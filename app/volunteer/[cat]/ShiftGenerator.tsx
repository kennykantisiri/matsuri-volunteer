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

function loadJSONFile(filePath: string) {

    try {
        const fileLocation = path.join(filePath);
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

function objectToShifts(jsonData: any, category: string): Shift[] {

    try {
        const jobName = jsonData?.job?.name || "Undefined Job";
        const jobDescription = jsonData?.job?.description || "No description provided.";
        const rawShifts = jsonData.generator.shifts || [];
       
        let splitShifts = null;

        const generatedShiftsArray: Shift[] = [];

        for (const shiftSection of rawShifts) {
            if (shiftSection.divideByMin !== undefined) {
                splitShifts = timeSplitter(shiftSection.start, shiftSection.end, shiftSection.divideByMin);
            } else {
                splitShifts = [{start: new Date(shiftSection.start).toISOString(), end: new Date(shiftSection.end).toISOString()}];
            }
            
            splitShifts.map((shift) => {
    
    
                const generatedId = category !== jobName.toLowerCase()
                    ? `${category}_${jobName.toLowerCase().replace(/\s/g, '_')}_${toHHMM(shift.start)}`
                    : `${jobName.toLowerCase()}-${toHHMM(shift.start)}`;
    
                generatedShiftsArray.push({
                    id: generatedId,
                    job: jobName,
                    description: jobDescription,
                    start: shift.start,
                    end: shift.end,
                    totalAvailability: shiftSection.people,
                    attributes: shiftSection.attributes || {}
                });
            });
        }

        

        return generatedShiftsArray

    } catch (error) {
        console.error(error);
        return []
    }
    

}

export function generateShifts(category: string) {

    
    const fileLocation = path.join(process.cwd(), "config", category + ".json");
    const folderLocation = path.join(process.cwd(), "config", category);

    try {
        const files = fs.readdirSync(folderLocation);
        const allShifts: Shift[] = [];

        files.forEach((file) => {
            if (file.endsWith(".json")) {
                const jsonData = loadJSONFile(path.join(folderLocation, file));
                const shifts = objectToShifts(jsonData, category);
                allShifts.push(...shifts);
            }
        });

        return allShifts;
    } catch {
        // Not a folder, try as a single file
    }

    try {
        const jsonData = loadJSONFile(fileLocation);
        const shifts = objectToShifts(jsonData, category);
        return shifts;
    } catch (error) {
        console.error("Error generating shifts:", error);
        return [];
    }

}






function toHHMM(date: string): string {
    const n = new Date(date);

    const hours = n.getHours().toString().padStart(2, "0");
    const minutes = n.getMinutes().toString().padStart(2, "0");
    return `${hours}${minutes}`;
}