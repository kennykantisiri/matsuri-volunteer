import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { checkSameCalendarDay } from "../volunteer/ClickableCategory";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatDateTable(startDate: Date, endDate: Date) {

    if (checkSameCalendarDay(startDate, endDate)) {

        return startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        + ", " + startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) + " - "
        + endDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    }

    return "";

}