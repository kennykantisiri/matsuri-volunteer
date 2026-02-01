import fs from "fs";
import path from "path";

export function getCategories() {
    const filePath = path.join(process.cwd(), "config", "categories.json");
    const fileContents = fs.readFileSync(filePath, "utf-8");

    const categories = JSON.parse(fileContents);

    return categories;
}

export function getCategory(id: string) {
    
}