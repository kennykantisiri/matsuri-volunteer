"use client"
import { ReactNode, ButtonHTMLAttributes } from "react";
import { useRouter } from "next/navigation";

// setting props types
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    onClick?: () => void;
    varient?: "primary" | "secondary";
    clickTo?: string;
}

// basically the parameters much match the type, the props
// are just shortcuts instead of doing like children = props.children for each
export default function Button({children, onClick, varient, clickTo, ...props }: ButtonProps) {

    const router = useRouter();
    const varientClasses = {
        primary: ""
    }

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (onClick) (onClick as React.MouseEventHandler)(e); // call any provided onClick
        if (clickTo) router.push(clickTo); // navigate if clickTo is provided
      };

    return (
        <button 
            {...props}
            onClick={handleClick} 
            className="px-4 py-2 bg-yellow-800 text-white rounded hover:bg-yellow-700 transition"
        >
            {children}
        </button>
    );
}