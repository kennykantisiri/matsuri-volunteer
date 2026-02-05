import Navbar from "@/app/components/Navbar";
import Login from "./login";
import Image from "next/image";
import { Header } from "../components/ui/text";

export default function LoginPage() {
    return (
        <div className="flex gap-y-8 flex-col h-screen items-center place-content-center">
            <div className="flex flex-col items-center w-80 text-center">
                <Image src="/matsuri-logo.png" alt="Matsuri logo" width={100} height={100} className="mb-4" />
                <p className="leading-6">Welcome to Matsuri Volunteer system. Please enter your email to login or sign up.</p>
            </div>
            
            <Login />
        </div>
    )
}