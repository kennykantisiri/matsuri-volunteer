'use client'

import Button from "@/app/components/Button";
import { createClient } from "@/app/lib/supabase/client";
import { useEffect, useState } from "react";
import handleSignUp from "./handleSignUp";

function formatPhone(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 10)
  
    if (digits.length < 4) return digits
    if (digits.length < 7)
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }


export default function SignUp() {

    const supabase = createClient();
    // const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const getUser =useEffect(() => {
        const supabase = createClient()
    
        supabase.auth.getUser().then(({ data }) => {
          if (data.user) {
            setEmail(data.user.email || "");
          }
        })
    }, [])
    

    return (
        <div>
            <div className="flex gap-y-8 flex-col h-screen items-center place-content-center">
                <h1>Sign Up</h1>
                <form action={handleSignUp} className="flex flex-col gap-y-3">
                    <input 
                        type="email"
                        name="email"
                        className="border p-2 rounded mb-1 bg-gray-100 cursor-not-allowed text-gray-500 pointer-events-none"
                        readOnly
                        value={email}
                        placeholder="Email" />
                    <div className="flex gap-5 w-full">
                        <input type="text" name="firstName" className="flex-1 border p-2 rounded" onChange={(e) => setFirstName(e.target.value)} value={firstName} placeholder="First Name" />
                        <input type="text" name="lastName" className="flex-1 border p-2 rounded" onChange={(e) => setLastName(e.target.value)} value={lastName} placeholder="Last Name" />
                        {/* <input type="text" className="flex-1 border p-2 rounded" onChange={(e) => setLastName(e.target.value)} value={lastName} placeholder="Last Name" /> */}
                    </div>
                    <input type="text" name="phoneNumber" className="border p-2 rounded" onChange={(e) => setPhoneNumber(formatPhone(e.target.value))} value={phoneNumber} placeholder="Phone Number" />
                    <Button type="submit">Sign Up</Button>
                </form>
            </div>
        </div>

    );
}