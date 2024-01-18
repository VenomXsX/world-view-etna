"use client";

import SearchBox from "./SearchBox";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Flag } from "lucide-react";
import Icon from "./Icon";

export default function Navbar() {
  const router = useRouter();
  const onSeach = (q: string) => {
    router.push(`/results?q=${q}`);
  };
  return (
    <nav className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white/10 backdrop-blur-md fixed top-0 z-20">
      <div className="flex flex-col sm:flex-row sm:items-center">
        <div className="flex flex-row justify-between items-center">
          <span className="py-4 font-bold text-secondary text-2xl font-serif tracking-tighter">
            <a href="/" className="p-4">
              <Icon className="w-8 h-8 inline text-secondary" type="Logo"/>
              World View
            </a>
          </span>
          <Link
            title="click here for some fun ;)"
            href={"/guesstheflag"}
            className="p-2 rounded-sm text-secondary/70 italic hover:shadow-md hover:shadow-secondary hover:-translate-y-1 duration-200"
          >
            <Flag className="pointer-events-none" />
          </Link>
        </div>
        <SearchBox submitFn={onSeach} />
      </div>
    </nav>
  );
}
