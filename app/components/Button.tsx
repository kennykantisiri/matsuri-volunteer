import { ReactNode } from "react";

// setting props types
type ButtonProps = {
    children: ReactNode;
    onClick?: () => void;
    varient?: "primary" | "secondary";
}

// basically the parameters much match the type, the props
// are just shortcuts instead of doing like children = props.children for each
export default function Button({children, onClick, varient }: ButtonProps) {

    const varientClasses = {
        primary: ""
    }

    return (
        <button 
            onClick={onClick} 
            className="px-4 py-2 bg-yellow-800 text-white rounded hover:bg-yellow-700 transition"
        >
            {children}
        </button>
    );
}