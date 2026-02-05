export interface Category {
    id: string;
    name: string;
    description: string;
    color: string;
}

export interface CategoryDetails {
    earliestStart: Date;
    latestEnd: Date;
    availableSlots: number;
    totalSlots: number;
}