"use client"

import { useRouter } from "next/navigation";
import { getCategories } from "@/app/lib/volunteer";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
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

type Shift {
    name: string;
    location: string;
    startTime: string;
    endTime: string;
    filled: number;
    capacity: number;
    metaData: object;
    actions: object;
}

interface ShiftProps {
    data: Shift[];
}

export function JobTable({ data }: ShiftProps) {



    const table = useReactTable({ data: data, columns, getCoreRowModel: getCoreRowModel() });
    
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