"use client"

import { useRouter } from "next/navigation";
import { CategoryDetails } from "../lib/types";

interface Props {
    categoryId: string,
    name: string,
    color: string,
    description: string,
    categoryDetails: CategoryDetails;
}

function checkSameCalendarDay(date1: Date, date2: Date) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

export default function ClickableCategory({ categoryId, name, color, description, categoryDetails }: Props) {
    const router = useRouter();

    const date = categoryDetails.earliestStart.toLocaleDateString('en-US').split('T')[0] + 
                (!checkSameCalendarDay(categoryDetails.earliestStart, categoryDetails.latestEnd) ? ` - ${categoryDetails.latestEnd.toLocaleDateString('en-US').split('T')[0]}` : ''); 

    return (
        <div 
            key = {categoryId}
            className="flex flex-col gap-y-10 rounded-md p-5 m-2 cursor-pointer hover:brightness-90 transition" 
            style={{ backgroundColor: color }}
            onClick={() => router.push(`/volunteer/${categoryId}`)}
            >
                <div>
                    <b>{name}</b>
                    <p>{description}</p>
                </div>
                <div>
                    <div><b>Date:</b> {date}</div>
                    <div><b>Availability:</b> {categoryDetails.totalSlots} / {categoryDetails.totalSlots}</div>
                </div>
        </div>
    );
}

