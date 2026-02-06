
"use server";

import { createClient } from "@/app/lib/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from 'next/headers'
// import { Profile } from "@/app/lib/types";

export default async function handleSignUp(formData: FormData) {

    const supabase = await createClient()

    const {
        data: { user }
    } = await supabase.auth.getUser();

    
    if (!user) {
        redirect('/auth')
    }


    const { data, error: profileSetError } = await supabase
        .from('profiles')
        .update({ first_name: formData.get('firstName'), last_name: formData.get('lastName'), phone: formData.get('phoneNumber')})
        .eq('user_id', user?.id)
        .select('*');


    if (profileSetError) {
        console.error("Error inserting profile:", profileSetError);
        redirect('/auth/signup?error=Profile creation failed');
    }

    redirect('/volunteer')

    
    
    
//     const supabase = createClient();

//     const { data, error } = await supabase.from("profiles").select("*").eq("email", profile.email).single();

//     if (data) {
//         return { error: "User already exists" };
//     }

//     const { error: insertError } = await supabase.from("profiles").insert(profile);

//     if (insertError) {
//         return { error: insertError.message };
//     }

//     return { success: true };
}