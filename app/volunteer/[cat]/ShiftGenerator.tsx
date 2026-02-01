import { Category } from "@/app/lib/types";
import fs from "fs";
import path from "path";

export interface Shift {
    id: string;
    job: string;
    description: string;
    start: string;
    end: string;
    totalAvailability: number;
    attributes: Record<string, any>;
}

function loadShifts(filePath: string) {

    try {
        const fileLocation = path.join(process.cwd(), "config", filePath + ".json");
        const content = fs.readFileSync(fileLocation, 'utf-8');
        return JSON.parse(content);
    }

    catch (error) {
        console.error("Error reading shifts file:", error);
        return [];
    }
    
}

function timeSplitter(startTime: string, endTime: string, intervalMinutes: number): {start: string, end: string}[] {
    const slots: { start: string, end: string }[] = [];

    let currentTime = new Date(startTime);
    const endDateTime = new Date(endTime);
    
    while (currentTime < endDateTime) {
        const slotStart = new Date(currentTime);
        currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes);
        const slotEnd = currentTime > endDateTime ? endDateTime : new Date(currentTime);
        
        slots.push({
            start: slotStart.toISOString(),
            end: slotEnd.toISOString()
        });
    }

    return slots;
}

export function generateShifts(filePath: string) {

    try {
        const rawJob = loadShifts(filePath);
        const jobName = rawJob.job.name || "Undefined Job";
        const jobDescription = rawJob.job.description || "No description provided.";
        const rawShifts = rawJob.generator.shifts || [];
        let splitShifts = null;

        if (rawShifts[0].divideByMin !== undefined) {
            splitShifts = timeSplitter(rawShifts[0].start, rawShifts[0].end, rawShifts[0].divideByMin);
        } else {
            splitShifts = [{start: new Date(rawShifts[0].start).toISOString(), end: new Date(rawShifts[0].end).toISOString()}];
        }

        const generatedShiftsArray: Shift[] = [];
        
        splitShifts.map((shift) => {
            generatedShiftsArray.push({
                id: `${filePath}-${toHHMM(shift.start)}`,
                job: jobName,
                description: jobDescription,
                start: shift.start,
                end: shift.end,
                totalAvailability: rawShifts[0].people,
                attributes: rawShifts[0].attributes || {}
            });
        });

        return generatedShiftsArray;
    } catch (error) {
        console.log(error)
        return null;
    }
}


function toHHMM(date: string): string {
    const n = new Date(date);

    const hours = n.getHours().toString().padStart(2, "0");
    const minutes = n.getMinutes().toString().padStart(2, "0");
    return `${hours}${minutes}`;
}