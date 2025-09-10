import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("✅ New client connected");

ws.on("message", (msg) => {
  const text = msg.toString(); // Buffer → string
  console.log("📩 Raw message:", text);

  // Broadcast to all other clients as plain text
  wss.clients.forEach((client) => {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send(text); // ✅ always string
    }
  });
});

  ws.on("close", () => console.log("❌ Client disconnected"));
});

console.log("🌍 WebSocket server running on ws://localhost:8080");
