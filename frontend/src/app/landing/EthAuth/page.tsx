"use client";
import { Press_Start_2P } from "next/font/google"; 
import { ethers, verifyMessage } from "ethers";
import { useState } from "react";
import { useRouter } from 'next/navigation';

const pixelFont = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
});

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function EthAuthPage() {
  const router = useRouter();
  const [address, setAddress] = useState<string | null>(null);

  async function connectWallet() {
    if (!window.ethereum) {
      alert("Please install MetaMask or another Ethereum wallet.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);

      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      const message = `Sign this message to login at ${new Date().toISOString()}`;
      const signature = await signer.signMessage(message);

      const recoveredAddress = verifyMessage(message, signature);

      if (recoveredAddress.toLowerCase() === userAddress.toLowerCase()) {
        setAddress(userAddress);
        alert("Wallet connected & verified! Address: " + userAddress);
        router.push('/dashboard'); 
      } else {
        alert("Signature verification failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Wallet connection failed.");
    }
  }
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <video
        src="https://llamaland.arweave.net/assets/video.webm"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="absolute inset-0  z-1"></div>
      <img
        src="https://llamaland.arweave.net/assets/branding/LLAMA_coin_large.png"
        alt="Llama Coin"
        className="w-28 h-28 pixelated z-10 transition animate-bounce"
      />
      <div className={`mt-6 flex flex-col items-center gap-3 z-10 ${pixelFont.className} text-pink-300`}>
        <p className="text-xl md:text-xl text-white">WALLET LOGIN</p>
        <button
          onClick={connectWallet}
          className="cursor-pointer bg-blue-600 border-4 border-blue-800 px-4 py-2 text-white hover:bg-blue-500 transition"
        >
          {address ? `Connected: ${address.slice(0, 6)}...${address.slice(-4)}` : "Connect Wallet (Web3 Login)"}
        </button>
      </div>
    </div>
  );
}
