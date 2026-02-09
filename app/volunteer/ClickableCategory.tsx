"use client"

import { useRouter } from "next/navigation";
import { CategoryDetails } from "../lib/types";
import { getShifts } from "../lib/volunteer";
import { useEffect } from "react";

interface Props {
    categoryId: string,
    name: string,
    color: string,
    description: string,
    categoryDetails: CategoryDetails;
}

export function checkSameCalendarDay(date1: Date, date2: Date) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

function getOrdinal(n: number): string {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }
  
function formatDate(date: Date): string {
    const month = date.toLocaleString("en-US", { month: "short" });
    const day = getOrdinal(date.getDate());
    return `${month} ${day}`;
}
  

export default function ClickableCategory({ categoryId, name, color, description, categoryDetails }: Props) {
    const router = useRouter();

    const date =
        formatDate(categoryDetails.earliestStart) +
        (!checkSameCalendarDay(
            categoryDetails.earliestStart,
            categoryDetails.latestEnd
        )
            ? ` - ${getOrdinal(categoryDetails.latestEnd.getDate())}`
            : "");


    return (
        <div 
            key = {categoryId}
            className="flex flex-col gap-y-10 rounded-md p-5 m-2 cursor-pointer hover:brightness-90 transition" 
            style={{ backgroundColor: color }}
            onClick={() => router.push(`/volunteer/${categoryId}`)}
            >
                <div>
                    <b className="text-xl">{name}</b>
                    <p>{description}</p>
                </div>
                <div>
                    <div><b>Date:</b> {date}</div>
                    <div><b>Availability:</b> {categoryDetails.totalSlots - categoryDetails.filledSlots} / {categoryDetails.totalSlots} slots</div>
                </div>
        </div>
    );
}

