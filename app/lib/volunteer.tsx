import fs from "fs";
import path from "path";
import { Category } from "./types";
import { generateShifts } from "../volunteer/[cat]/ShiftGenerator";

export function getCategories() {
    const filePath = path.join(process.cwd(), "config", "categories.json");
    const fileContents = fs.readFileSync(filePath, "utf-8");

    const categories = JSON.parse(fileContents);

    return categories;
}

function sumPeople(people: { [key: string]: number }): number {
    let total = 0;
        for (const key in people) {
            total += people[key];
        }
    return total;
}

export function getCategoryDetails(category: Category) {

    const shifts = generateShifts(category.id);
    let earliestStart = new Date(shifts[0].start);
    let latestEnd = new Date(shifts[0].end);
    let totalSlots = 0;

    for (const shift of shifts) {
        if (new Date(shift.start) < earliestStart) {
            earliestStart = new Date(shift.start);
        }

        if (new Date(shift.end) > latestEnd) {
            latestEnd = new Date(shift.end);
        }

        if (typeof shift.totalAvailability === "object" && shift.totalAvailability !== null) {
            shift.totalAvailability = sumPeople(shift.totalAvailability);
        } 
        
        if (typeof shift.totalAvailability === "number") {
            totalSlots = totalSlots + shift.totalAvailability;
        }
    }

    const details = {
        earliestStart: earliestStart,
        latestEnd: latestEnd,
        availableSlots: 0,
        totalSlots: totalSlots
    }
    
    console.log(details)

    return details;
}