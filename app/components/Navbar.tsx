"use client"

import Link from "next/link";

export default function Navbar() {
    return (
        <div className="bg-[#D3D3D3]">
            <nav className="p-3 px-10">
                <div className="flex flex-1 items-center justify-between">
                    <p>Matsuri Volunteer Portal</p>
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