"use client"

import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
    return (
        <div className="bg-[#D3D3D3]">
            <nav className="p-3 px-10">
                <div className="flex flex-1 items-center justify-between">
                    <div className="flex align-center items-center">
                        <Image src="/matsuri-logo.png" alt="Matsuri logo" width={30} height={30} className="mr-3" />
                        <p><b><span className="text-[#946331]">MATSURI 2026</span> <span className="text-[#452B11]">VOLUNTEER PORTAL</span></b></p>
                    </div>
                    <div className="flex gap-x-5">
                        <Link href="/" className="text-small text-[#452B11]">Home</Link>
                        <Link href="/" className="text-small text-[#452B11]">My Shifts</Link>
                        <Link href="/" className="text-small text-[#452B11]">Logout</Link>
                    </div>
                </div>
            </nav>
        </div>
    );
}