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

      <div className="absolute inset-0 bg-purple-900 opacity-40 z-1"></div>
      <img
        src={coinLogo.src}
        alt="Llama Coin"
        className="w-28 h-28 pixelated z-10"
      />
      <img
        src={llamaTitle.src}
        alt="Llama Land"
        className="w-[300px] md:w-[500px] mt-4 z-10 pixelated"
      />
      <div className={`mt-6 flex flex-col items-center gap-3 z-10 ${pixelFont.className} text-pink-300`}>
        <p className="text-xl md:text-xl text-pink-200 -mt-8">YOU MAY NOW ENTER <br/> THE LLAMA BATTLE</p>
        <button className="cursor-pointer bg-pink-500 border-4 border-pink-700 px-4 py-2 text-black hover:bg-pink-400 transition animate-bounce">
            ENTER BATTLE
        </button>

        <button>
            <p className="text-xl md:text-xl text-pink-200">Let's goo !!!</p>
        </button>
      </div>
    </div>
  );
}
