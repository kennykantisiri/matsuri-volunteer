"use client"

import * as React from "react"
import { twMerge } from "tailwind-merge";

interface HeaderProps extends React.ComponentProps<"h1"> {
    children: React.ReactNode;
    className?: string;
}

function Header({className, children, ...props }: HeaderProps) {
    const defaultClass = "text-2xl";
    const combinedClassName = twMerge(defaultClass, className);

    return (
        <h1 className={combinedClassName} {...props}>
             {children}
        </h1>
    );
}

export { Header}