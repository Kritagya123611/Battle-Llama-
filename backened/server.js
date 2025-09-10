// server.js (Node.js + ws) - minimal authoritative server
const WebSocket = require('ws');
const TICK_RATE = 20; // ticks per second
const TICK_MS = 1000 / TICK_RATE;
const PORT = 8080;

const wss = new WebSocket.Server({ port: PORT });
console.log('Game server listening on', PORT);

let nextPlayerId = 1;
const rooms = { "room1": { players: {}, running: true } };

// helper funcs
function now() { return Date.now(); }

function broadcastRoom(room, msgObj) {
  const json = JSON.stringify(msgObj);
  for (const pId in room.players) {
    const p = room.players[pId];
    if (p.ws && p.ws.readyState === WebSocket.OPEN) p.ws.send(json);
  }
}

// server accepts ws connections and assigns to room1
wss.on('connection', (ws, req) => {
  const playerId = String(nextPlayerId++);
  console.log('conn', playerId);
  // initial player state
  const player = {
    id: playerId,
    x: Math.random()*400 + 50,
    y: Math.random()*300 + 50,
    vx: 0, vy: 0,
    dir: 'down',
    hp: 100,
    ws,
    inputQueue: []
  };
  rooms.room1.players[playerId] = player;

  ws.send(JSON.stringify({ type: 'welcome', id: playerId }));

  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw);
      if (msg.type === 'input') {
        // msg: {type:'input', seq:123, up:bool, down:bool, left:bool, right:bool, ts}
        player.inputQueue.push(msg);
      }
    } catch(e){ console.warn('bad msg',e) }
  });

  ws.on('close', () => {
    delete rooms.room1.players[playerId];
    console.log('disconnect', playerId);
  });
});

// simple physics constants
const SPEED = 120; 
const ATTACK_DAMAGE = 20;
const COLLIDE_DISTANCE = 24;

function applyInputToPlayer(player, input, dt) {
  let dx = 0, dy = 0;
  if (input.left) dx -= 1;
  if (input.right) dx += 1;
  if (input.up) dy -= 1;
  if (input.down) dy += 1;
  const len = Math.sqrt(dx*dx + dy*dy) || 1;
  player.x += (dx/len) * SPEED * dt;
  player.y += (dy/len) * SPEED * dt;
}

function stepRoom(room, dt) {
  // apply queued inputs for each player
  for (const id in room.players) {
    const p = room.players[id];
    // drain inputQueue (simple: apply latest)
    const latest = p.inputQueue.length ? p.inputQueue[p.inputQueue.length-1] : null;
    p.inputQueue = []; // clear
    if (latest) {
      applyInputToPlayer(p, latest, dt);
    } else {
      // no input: do nothing (could slow friction)
    }
  }

  // collision checks & apply damage
  const players = Object.values(room.players);
  for (let i=0;i<players.length;i++) {
    for (let j=i+1;j<players.length;j++) {
      const a = players[i], b = players[j];
      const dx = a.x - b.x, dy = a.y - b.y;
      const dist2 = dx*dx + dy*dy;
      if (dist2 <= COLLIDE_DISTANCE*COLLIDE_DISTANCE) {
        // apply damage both ways (simple)
        a.hp -= ATTACK_DAMAGE * dt; // fractional damage per second
        b.hp -= ATTACK_DAMAGE * dt;
      }
    }
  }

  // remove dead players
  for (const id in room.players) {
    const p = room.players[id];
    if (p.hp <= 0) {
      // notify and disconnect
      if (p.ws && p.ws.readyState === WebSocket.OPEN) {
        p.ws.send(JSON.stringify({ type: 'dead' }));
        p.ws.close();
      }
      delete room.players[id];
    }
  }

  // broadcast snapshot
  const snapshot = {
    type: 'snapshot',
    t: Date.now(),
    players: Object.values(room.players).map(p => ({ id: p.id, x: p.x, y: p.y, hp: Math.round(p.hp) }))
  };
  broadcastRoom(room, snapshot);
}

// main loop
setInterval(() => {
  const dt = 1 / TICK_RATE;
  for (const rn in rooms) {
    stepRoom(rooms[rn], dt);
  }
}, TICK_MS);
