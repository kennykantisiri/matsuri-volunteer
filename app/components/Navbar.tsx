"use client"

import Link from "next/link";
import Image from "next/image";
import { useRouter, redirect } from "next/navigation";
import { createClient } from "../lib/supabase/client";

async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    redirect("/")
}

export default function Navbar() {

    const router = useRouter();
    const supabase = createClient()

    return (
        <div className="bg-[#D3D3D3]">
            <nav className="p-3 px-10">
                <div className="flex flex-1 items-center justify-between">
                    <div className="flex align-center cursor-pointer items-center" onClick={() => router.push("/")}>
                        <Image src="/matsuri-logo.png" alt="Matsuri logo" width={30} height={30} className="mr-3" />
                        <p><b><span className="text-[#946331]">MATSURI 2026</span> <span className="text-[#452B11]">VOLUNTEER PORTAL</span></b></p>
                    </div>
                    <div className="flex gap-x-5">
                        <Link href="/" className="text-small text-[#452B11]">Home</Link>
                        <Link href="/" className="text-small text-[#452B11]">My Shifts</Link>
                        <button onClick={async () => {await handleLogout()}} className="cursor-pointer text-small text-[#452B11]">Logout</button>
                    </div>
                </div>
            </nav>
        </div>
    );
}