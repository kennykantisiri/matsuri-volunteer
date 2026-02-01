import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="p-4 flex items-center justify-between">
        <Link target="_blank" href="https://sdmatsuri.com" className="text-small text-[#452B11]">Matsuri 2026 Main Website</Link>
        </nav>
    );
}