import fs from "fs";
import path from "path";
import { Category, CategoryDetails } from "./types";
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


export function getCategoryDetails(category: Category): CategoryDetails {

    const shifts = generateShifts(category.id);
    let earliestStart = shifts[0].start;
    let latestEnd = shifts[0].end;
    let totalSlots = 0;

    for (const shift of shifts) {
        if (shift.start < earliestStart) {
            earliestStart = shift.start;
        }

        if (shift.end> latestEnd) {
            latestEnd =shift.end;
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
    

    return details;
}