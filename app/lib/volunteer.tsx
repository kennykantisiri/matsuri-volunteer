"use server"

import { createClient } from "@/app/lib/supabase/server";
import { Category, Shift } from "./types";
import { getCategories } from "./category";
import { generateShifts } from "../volunteer/[cat]/util/ShiftGenerator";

type Scope = "user" | "all";

export async function getShiftCount(category: Category) {
    getShifts("all")
}

export async function getShifts(scope: Scope, filter?: string): Promise<any> {
    
    const supabase = await createClient();

    const {
        data: { user } 
    } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }


    if (scope === "all") {
        const { data, error } = await supabase
            .from('signups')
            .select('*');

        if (error) {
            console.error("Error fetching all shifts:", error);
            return null;
        }

        return data;
    }

    if (scope === "user") {
        const { data, error } = await supabase
            .from('signups')
            .select('*')
            .eq('user_id', user?.id);

        if (error) {
            console.error("Error fetching user shifts:", error);
            return null;
        }

        return data;
    }

    return [];
}

export async function getAllShiftNames(includeSelf: boolean = false): Promise<any[]> {

    const supabase = await createClient();
    const user = await supabase.auth.getUser();

    const query = supabase
            .from("signup_with_names")
            .select("*");

    if (!includeSelf && user) {
        query.neq("user_id", user)
    } 
    
    const { data, error } = await query;

    if (error) {
        console.error("Error giving up shift:", error);
        return [];
    }

    return data;

}


export async function getFormattedAllSignups(): Promise<Shift[]> {

    const data = await getShifts("all");

    const shifts: Shift[] = [];
    const categories: Category[] = getCategories();
    
    for (const category of categories) {
        let iterableShiftArray = generateShifts(category.id.toLowerCase());
        for (const signup of data) {
            const matchedShift = iterableShiftArray.find(
                shift => shift.id === signup.shift_id
            );

            if (matchedShift) {
                shifts.push(matchedShift);
              }
        }

    }

    return shifts;

}

export async function getShiftFilledCount(shiftId: string): Promise<number | null> {
    const supabase = await createClient();

    const {
        data: { user } 
    } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    const { count, error } = await supabase
        .from("signups")
        .select("*", { count: "exact", head: true })
        .eq("shift_id", shiftId)

    if (error) throw error;

    return count;
}

export async function signUp(shift: Shift) {
    const supabase = await createClient();

    const {
        data: { user } 
    } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    const { error } = await supabase
        .from('signups')
        .insert({
            user_id: user.id,
            timestamp: new Date().toISOString(),
            shift_id: shift.id,
            attributes: shift.attributes
        });

    if (error) {
        console.error("Error signing up for shift:", error);
        return null;
    }

    return true;
}

export async function giveUp(shift: Shift) {
    const supabase = await createClient();

    const {
        data: { user } 
    } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    const { error } = await supabase
        .from('signups')
        .delete()
        .eq('user_id', user.id)
        .eq('shift_id', shift.id);

    if (error) {
        console.error("Error giving up shift:", error);
        return null;
    }

    return true;

}

export async function getUserShifts(): Promise<Shift[] | null> {
    const supabase = await createClient();

    const {
        data: { user } 
    } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    const { data, error } = await supabase
        .from('signups')
        .select('*')
        .eq('user_id', user?.id);

    if (error) {
        console.error("Error fetching user shifts:", error);
        return null;
    }

    const shifts: Shift[] = [];
    const categories: Category[] = getCategories();
    
    for (const category of categories) {
        let iterableShiftArray = generateShifts(category.id.toLowerCase());
        for (const iterableShift of iterableShiftArray) {
            if (data.some((signup) => signup.shift_id === iterableShift.id)) {
                shifts.push(iterableShift);
            }
        }

    }

    return shifts;
}

// used to prevent double times
export async function getUserStartTimestamps(): Promise<number[] | null> {
    const supabase = await createClient();

    const {
        data: { user } 
    } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    const { data, error } = await supabase
        .from('signups')
        .select('*')
        .eq('user_id', user?.id);

    if (error) {
        console.error("Error fetching user shifts:", error);
        return null;
    }

    const startTimestamps: number[] = [];
    const categories: Category[] = getCategories();
    
    for (const category of categories) {
        let iterableShiftArray = generateShifts(category.id.toLowerCase());
        for (const iterableShift of iterableShiftArray) {
            if (data.some((signup) => signup.shift_id === iterableShift.id)) {
                startTimestamps.push(iterableShift.start.getTime());
            }
        }

    }

    return startTimestamps;
}

export async function readProfile() {
    const supabase = await createClient();
    
    const {
        data: { user } 
    } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, email, phone')
        .eq('user_id', user.id)
        .single();

    if (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }

    return data;
}

export async function getFirstName(): Promise<string> {

    const profile = await readProfile();

    if (profile) {
        return profile.first_name;
    }

    else {
        return "";
    }

    
}