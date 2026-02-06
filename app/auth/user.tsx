import { redirect } from "next/navigation";
import { createClient } from "../lib/supabase/client";

export async function userSignedIn(): Promise<boolean> {
    const supabase = createClient();

    const { data, error } = await supabase.auth.getUser();

    if (!data.user == null) {
        return false;
    } 

    return true;

}