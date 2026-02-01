"use client"
import { useState } from "react";

export default function SearchJob() {

    const [value, setValue] = useState("");
    
    return (
        <input 
        className="border rounded focus:outline-none focus:ring-2"
        type="text" 
        onChange={(e) => setValue(e.target.value)}
        value={value} />
    );
}