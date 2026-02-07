import Navbar from "../components/Navbar"
import { getCategories, getCategoryDetails } from "../lib/category";
import { Category } from "../lib/types";
import { Header } from "@/app/components/ui/text";
import ClickableCategory from "./ClickableCategory";
import { getFirstName } from "../lib/volunteer";
// import { useState } from "react";

// const categories = [
//     { name: "Food", color: "#F8EDEB", description: "Help with food on the day-of", id: "food" },
//     { name: "Games", color: "#F8EDEB", description: "Help with games on the day-of", id: "games" },
//     { name: "Chalkboarding", color: "#D8E2DC", description: "Help with chalkboarding", id: "chalkboarding" },
//     { name: "Food Prep", color: "#FFD7BA", description: "Help with food preparation", id: "food-prep" },
//     { name: "Setup", color: "#FFD7BA", description: "Help with event setup", id: "setup" },
//     { name: "Clean Up", color: "#FFD7BA", description: "Help with event clean up", id: "clean-up" },
//     { name: "Flyering", color: "#ECE4DB", description: "Help with flyering before the event", id: "flyering" },
//     { name: "Cashier", color: "#ECE4DB", description: "Help with cashier duties", id: "cashier" }
// ]

export default async function VolunteerPage() {

    // const [firstName, setFirstName] = useState("Loading...");

    const firstName = await getFirstName();
    
    
    return (
        <div>
            <Navbar />
            <Header className="p-8 m-2">Welcome, {firstName.charAt(0).toUpperCase() + firstName.slice(1)}! Please begin by <b>selecting a category.</b></Header>
            <div className="grid grid-cols-3 px-8">
                {getCategories().map((cat: Category) => (
                    <ClickableCategory 
                        key={cat.id}
                        categoryId={cat.id}
                        name={cat.name}
                        color={cat.color}
                        description={cat.description}
                        categoryDetails={getCategoryDetails(cat)} />
                ))}
            </div>
        </div>
    )

}