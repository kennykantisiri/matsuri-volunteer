"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/lib/supabase/client";
import Button from "../components/Button";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [userExists, setUserExists] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);

    // const handleCheckEmail = async(e: React.FormEvent) => {
    //     e.preventDefault();
    //     setError(null);

    //     const { data, error } = await supabase.from("auth.users").select("*").eq("email", email).single();
    //     if (error && error.message.includes('User not found')) {
    //         setUserExists(false);
    //     } else if (error) {
    //         setError(error.message);
    //     } else {
    //         setUserExists(true)
    //     }

    // }

    const handleLogin = async () => {
        const { error } = await createClient().auth.signInWithOAuth({ 
            provider: 'google',
            options: {
                redirectTo: 'http://localhost:3000/auth/callback'
            }
        });
        // if (error) setMessage ("Error sending email: " + error.message);
        // else (setMessage("Check your email for the login link!"));
    }

    return (
        <div className="flex flex-col gap-y-3 align-items-center text-center justify-center">
            <h1 className="text-xl font-bold">Login</h1>
            {/* <input 
                type="email" 
                placeholder="Enter your email" 
                className="border p-2 rounded w-64 mb-4"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            /> */}
            <Button className="border text-left p-3" onClick={handleLogin}>Login with Google</Button>
            {message && <p>{message}</p>}
        </div>
    )
}