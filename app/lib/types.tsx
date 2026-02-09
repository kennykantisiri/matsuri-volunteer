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

export interface Shift {
    id: string;
    job: string;
    description: string;
    start: Date;
    end: Date;
    totalAvailability: number;
    category: string;
    attributes: Record<string, any>;
}

export interface Profile {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
}