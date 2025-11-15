import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col gap-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      Home Screen
      <Link className="flex bg-amber-700 p-2 rounded-md" href={"/login"}>
        Login
      </Link>
      <Link className="flex bg-amber-700 p-2 rounded-md" href={"/signup"}>
        Singup
      </Link>
    </div>
  );
}
