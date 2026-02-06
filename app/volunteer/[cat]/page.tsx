import Button from "@/app/components/Button"
import Navbar from "@/app/components/Navbar"
import { getCategories } from "@/app/lib/volunteer"
import { Category } from "@/app/lib/types"
// import JobTable from "./JobTable";
import { Header } from "@/app/components/ui/text";
import { generateShifts } from "./ShiftGenerator";
import { Shift } from "@/app/lib/types";
import SearchJob from "./SearchJob";
import { JobTable } from "./JobTable";

interface PageProps {
    // since params is a promise, we need to await it since of NextJS 13 async server components
    params: Promise<{ cat: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
    const categories: Category[] = getCategories();
    const { cat } = await params;
    const category = categories.find((c) => c.id === cat);
    let shifts = null;


    if (category === undefined) {
        return <div>Category not found</div>
        
    }
    
    try {
        shifts = generateShifts(category?.id.toLowerCase() || "");
        // console.log(shifts)
    } catch (error) {
        console.error("Error generating shifts:", error);
        return <div>Error generating shifts</div>
    }

    return (
        <div>
            <Navbar />
            <div className="p-8">
                <Button clickTo={"/volunteer"}>Back</Button>
                <div className="flex flex-col mt-5 gap-y-5">
                    <div className="mt-5 gap-y-3 flex">
                        <Header className="flex-1">{category.name}</Header>
                        <SearchJob />
                    </div>
                
                    <JobTable data={shifts}/>
                </div>
                
            </div>
        </div>
    )
};