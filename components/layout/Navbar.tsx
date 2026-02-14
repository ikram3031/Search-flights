"use client";

import Link from "next/link";

type Props = {};

const Navbar = (props: Props) => {
  return (
    <header className="w-full h-16 bg-white text-black flex items-center justify-center px-4">
      <div className="text-2xl font-bold">
        <Link href="/">FLYNEXT</Link>
      </div>
    </header>
  );
};

export default Navbar;
