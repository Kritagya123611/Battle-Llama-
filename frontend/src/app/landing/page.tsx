'use client'
import coinLogo from "../files/coin.png"; 
import llamaTitle from "../files/llama_logo.png"; 
import { Press_Start_2P } from "next/font/google"; 
import { useRouter } from 'next/navigation';

const pixelFont = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
});

export default function LandingPage() {
  const router = useRouter();
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

      <div className="absolute inset-0 z-1"></div>
      <img
        src={coinLogo.src}
        alt="Llama Coin" //added log here
        className="w-28 h-28 pixelated z-10 transition animate-bounce"
      />
      <img
        src={llamaTitle.src}
        alt="Llama Land"
        className="w-[300px] md:w-[500px] mt-4 z-10 pixelated"
      />
      <div className={`mt-6 flex flex-col items-center gap-3 z-10 ${pixelFont.className} text-pink-300`}>
        <p className="text-xl md:text-xl text-white">SIGN IN</p>

        <button onClick={() => router.push('/landing/EthAuth')} className="cursor-pointer bg-pink-500 border-4 border-pink-700 px-4 py-2 text-black hover:bg-pink-400 transition">
          ETHCONNECT/INJECTED
        </button>
        <button onClick={() => router.push('/landing/GoogleAuth')} className="cursor-pointer bg-yellow-400 border-4 border-yellow-600 px-4 py-2 text-black hover:bg-yellow-300 transition">
          OTHER (VIA GOOGLE)
        </button>
      </div>
    </div>
  );
}
