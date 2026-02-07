"use server"

import { createClient } from "@/app/lib/supabase/server";
import { Shift } from "./types";
import { timeStamp } from "console";
import { create } from "domain";
import { read } from "fs";

type Scope = "user" | "all";

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