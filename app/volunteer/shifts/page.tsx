"use client"

import Navbar from "@/app/components/Navbar";
import ShiftCard from "./ShiftCard";
import { Header } from "@/app/components/ui/text";
import { getUserShifts } from "@/app/lib/volunteer";
import { useEffect, useState } from "react";
import { Shift } from "@/app/lib/types";


export default function ShiftsPage() {

    const [shifts, setShifts] = useState<Shift[]>([]);
    const [loading, setLoading] = useState(true);

    async function fetchShifts() {
        setLoading(true);
        const userShifts = await getUserShifts();
        setShifts(userShifts ?? []);
        setLoading(false);
      }
    
      useEffect(() => {
        fetchShifts();
      }, []);
    
    return (
        <div>
            <Navbar />
            <Header className="text-2xl mt-5 mb-3 px-8">My Shifts</Header>
            <div className="grid m-5 gap-x-10 grid-cols-4 px-8">
                {loading 
                ? (<div>Loading...</div>)
                : (
                    shifts.map(shift => (
                        <ShiftCard key={shift.id} shift={shift} onSuccess={fetchShifts} />
                    ))
                )}
            </div>
        </div>
    )

}