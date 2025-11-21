"use client";
import Link from "next/link";
import VideoPlayer from "./_components/VideoPlayer";
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState(
    `https://www.youtube.com/embed/gTxIEtKU-9s?si=MSWW_WcCYEMo-0q5&autoplay=1&loop=1&mute=1&playlist=gTxIEtKU-9s`
  );
  const [videoId, setVideoId] = useState("");

  const handleSubmit = () => {
    if (videoId !== "") {
      setUrl(
        `https://www.youtube.com/embed/${videoId}?si=MSWW_WcCYEMo-0q5&autoplay=1&loop=1&mute=1&playlist=${videoId}`
      );
    }
  };
  return (
    <div className="flex min-h-screen flex-col gap-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      Home Screen
      <Link className="flex bg-amber-700 p-2 rounded-md" href={"/login"}>
        Login
      </Link>
      <Link className="flex bg-amber-700 p-2 rounded-md" href={"/signup"}>
        Singup
      </Link>
      <div className="bg-white p-6 flex gap-4">
        <input
          className="border-red-400 border-1"
          type="text"
          placeholder="Ex : gTxIEtKU-9s"
          onChange={(e) => setVideoId(e.target.value)}
        />
        <button
          className="bg-blue-500 p-2 border-sky-200 roundend-md"
          onClick={handleSubmit}
        >
          Set Link
        </button>
      </div>
      <div className="flex w-full flex-wrap">
        {url &&
          Array.from({ length: 20 }).map((_, i) => (
            <VideoPlayer key={i} url={url} />
          ))}
      </div>
    </div>
  );
}
