"use client"

import { useRouter } from "next/navigation";

interface Props {
    categoryId: string,
    name: string,
    color: string,
    description: string
}

export default function ClickableCategory({ categoryId, name, color, description }: Props) {
    const router = useRouter();

    return (
        <div 
            key = {categoryId}
            className="flex flex-col rounded-md p-5 m-2 cursor-pointer hover:brightness-90 transition" 
            style={{ backgroundColor: color }}
            onClick={() => router.push(`/volunteer/${categoryId}`)}
            >
                <b>{name}</b>
                <p>{description}</p>
        </div>
    );
}
