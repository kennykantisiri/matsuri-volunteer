"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from '@/app/components/Button';
import Link from "next/link";

export default function Home() {

  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      
      <nav className="p-4 items-center justify-between">
        <Link target="_blank" href="https://sdmatsuri.com" className="text-small text-[#452B11]">Matsuri 2026 Main Website</Link>
      </nav>

      <div className="flex flex-1 flex-col gap-y-8 items-center justify-center">
        <Image src="/matsuri-logo.png" alt="Matsuri logo" width={200} height={200} className="mb-4" />
        <div className="flex flex-col gap-y-2 items-center justify-center text-center">
          <h1 className="mt-4 text-3xl font-black text-[#946331]" style={{ fontFamily: "var(--font-inter)" }}>
            MATSURI 2026
          </h1>

          <h1 className="text-5xl font-black text-[#452B11]" style={{ fontFamily: "var(--font-inter)" }}>
            VOLUNTEER PORTAL
          </h1>
        </div>

        <div className="flex flex-col gap-y-5 items-center justify-center text-center">
          <div className="flex items-center justify-center text-center">
            <Button onClick={() => router.push("/auth")}>Volunteer Now</Button>
          </div>
          

          {/* <div className="flex items-center justify-center text-center">
            <p>Already signed up? <br></br><span className="underline underline-offset-4">Manage your shifts here</span></p>
          </div> */}
        </div>
        
      </div>
      
      
    </div>
  );
}