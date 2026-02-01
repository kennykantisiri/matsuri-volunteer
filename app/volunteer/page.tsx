import Navbar from "../components/Navbar"

const categories = [
    { name: "Food", color: "#F8EDEB", description: "Help with food on the day-of", id: "food" },
    { name: "Games", color: "#F8EDEB", description: "Help with games on the day-of", id: "games" },
    { name: "Chalkboarding", color: "#D8E2DC", description: "Help with chalkboarding", id: "chalkboarding" },
    { name: "Food Prep", color: "#FFD7BA", description: "Help with food preparation", id: "food-prep" },
    { name: "Setup", color: "#FFD7BA", description: "Help with event setup", id: "setup" },
    { name: "Clean Up", color: "#FFD7BA", description: "Help with event clean up", id: "clean-up" },
    { name: "Flyering", color: "#ECE4DB", description: "Help with flyering before the event", id: "flyering" },
    { name: "Cashier", color: "#ECE4DB", description: "Help with cashier duties", id: "cashier" }
]

export default function VolunteerPage() {
    return (
        <div>
            <Navbar />
            <div className="grid grid-cols-3 p-8">
                {categories.map((cat) => (
                    <div 
                    key = {cat.id}
                    className="flex flex-col rounded-md p-5 m-2 cursor-pointer hover:brightness-90 transition" 
                    style={{ backgroundColor: cat.color }}
                    >
                        <b>{cat.name}</b>
                        <p>{cat.description}</p>
                    </div>
                ))}
            </div>
        </div>
    )

}