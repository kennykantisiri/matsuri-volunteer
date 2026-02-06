"use client"

import { useRouter } from "next/navigation";
import { getCategories } from "@/app/lib/volunteer";
import { ArrowUpDown } from "lucide-react"

import {
    ColumnDef,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/app/components/ui/table"
import { Shift } from "@/app/lib/types";
import { checkSameCalendarDay } from "../ClickableCategory";
import Button from "@/app/components/Button";
import React from "react";


interface ShiftProps {
    data: Shift[];
}

function formatDateTable(startDate: Date, endDate: Date) {

    if (checkSameCalendarDay(startDate, endDate)) {

        return startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        + ", " + startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) + " - "
        + endDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    }

    return "";

}

export function JobTable({ data }: ShiftProps) {

    const [sorting, setSorting] = React.useState<SortingState>([]);

    const columns: ColumnDef<Shift>[] = [
        {
            accessorKey: "job",
            header: ({ column }) => {
                return (
                    <div className="flex flex-row items-center">
                        <p>Job</p>
                        <ArrowUpDown 
                            className="ml-2 h-4 w-4 cursor-pointer text-muted-foreground" 
                            onClick={() => {
                                column.toggleSorting(column.getIsSorted() === "asc");
                            }} />
                    </div>
                )
            },
            accessorFn: shift => ({
                name: shift.job,
                description: shift.description,
            }),
            cell: ({ getValue }) => {
                const { name, description } = getValue() as { name: string; description: string };
                return (
                  <div className="flex flex-col gap-y-">
                    <span className="font-medium">{name}</span>
                    <span className="text-sm text-muted-foreground">
                      {description}
                    </span>
                  </div>
                )
            }
        },
        {
            accessorKey: "location",
            header: "Location",
            accessorFn: shift => shift.attributes.location?.trim() || 'Library Walk',
        },
        {
            accessorKey: "time",
            header: "Time",
            accessorFn: shift => `${formatDateTable(shift.start, shift.end)}`,
        },
        {
            accessorKey: "totalAvailability",
            header: "Availability"
        },
        {
            id: "action",
            header: "",
            cell: action => {
                return (
                    <div className="ml-5 flex gap-x-2">
                        <Button onClick={() => console.log("hi")}>Sign Up</Button>
                        <Button onClick={() => console.log("hi")}>View Others</Button>
                    </div>
                )
            }
        }
    ]
    

    

    const table = useReactTable({ 
        data: data, 
        columns, 
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting
        }, 
    });
    
    return (
        <div className="overflow-hidden rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="bg-muted">
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext()
                                          )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                        <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                        >
                            {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                            ))}
                        </TableRow>
                        ))
                    ) : (
                        <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                            No results.
                        </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
    
}

// "use client"

// import { useRouter } from "next/navigation";

// import {
//     createColumnHelper,
//     flexRender,
//     getCoreRowModel,
//     useReactTable
// } from "@tanstack/react-table";

// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow
// } from "@/app/components/ui/table";

// export default function JobTable(shifts: any) {
//     const router = useRouter();
//     const columnHelper = createColumnHelper<any>();

//     const columns = [
//         columnHelper.accessor("job", { header: "Job" }),
//         columnHelper.accessor("location", { header: "Location" }),
//         columnHelper.accessor(row => `${row.start} - ${row.end}`, { header: "Time", id: "time" }),
//         columnHelper.accessor("totalAvailability", { header: "Availability" }),
//         columnHelper.accessor("action", { header: "" }),
//     ];
    
//     const table = useReactTable({data: shifts.shifts, columns, getCoreRowModel: getCoreRowModel()});

//     return (
//         <div className="mt-6 rounded-lg overflow-hidden border border-border">
//             <Table className="border">
//                 <TableHeader>
//                     {table.getHeaderGroups().map((headerGroup) => (
//                         <TableRow key={headerGroup.id} className="bg-muted">
//                             {headerGroup.headers.map((header) => (
//                                 <TableHead key={header.id}>
//                                     {header.isPlaceholder
//                                         ? null
//                                         : flexRender(
//                                               header.column.columnDef.header,
//                                               header.getContext()
//                                           )}
//                                 </TableHead>
//                             ))}
//                         </TableRow>
//                     ))}
//                 </TableHeader>
//                 <TableBody>
//                     {table.getRowModel().rows?.map((row) => (
//                         <TableRow
//                             key={row.id}
//                             className="cursor-pointer hover:bg-border/50 transition" 
//                             // onClick={() => router.push("/volunteer/sign-up?shift=" + row.id)}>
//                             >
//                                 {row.getVisibleCells().map((cell) => (
//                                     <TableCell key={cell.id} className="border">
//                                         {flexRender(
//                                             cell.column.columnDef.cell,
//                                             cell.getContext()
//                                         )}
//                                     </TableCell>
//                                 ))}
//                         </TableRow>
//                     ))}
//                 </TableBody>
//             </Table>
//         </div>
//     )

// }