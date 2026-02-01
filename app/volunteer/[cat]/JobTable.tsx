"use client"

import { useRouter } from "next/navigation";

import {
    createColumnHelper,
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
    TableRow
} from "@/app/components/ui/table";
import { Shift } from "./ShiftGenerator";   

const FlyeringShifts = [
    {
        position: "Flyering - Downtown",
        location: "Downtown Area",
        time: "10:00 AM - 12:00 PM",
        availability: "20/30 slots"
    },
    {
        position: "Flyering - University Campus",
        location: "University Campus",
        time: "1:00 PM - 3:00 PM",
        availability: "15/25 slots"
    }
];

export default function JobTable(shifts: any) {
    const router = useRouter();
    const columnHelper = createColumnHelper<any>();

    console.log(shifts.shifts)
    const columns = [
        columnHelper.accessor("job", { header: "Job" }),
        columnHelper.accessor("description", { header: "Location" }),
        columnHelper.accessor(row => `${row.start} - ${row.end}`, { header: "Time", id: "time" }),
        columnHelper.accessor("totalAvailability", { header: "Availability" }),
        columnHelper.accessor("action", { header: "" }),
    ];
    
    const table = useReactTable({data: shifts.shifts, columns, getCoreRowModel: getCoreRowModel()});

    return (
        <div className="mt-6 rounded-lg overflow-hidden border border-border">
            <Table className="border">
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
                    {table.getRowModel().rows?.map((row) => (
                        <TableRow
                            key={row.id}
                            className="cursor-pointer hover:bg-border/50 transition"
                            onClick={() => router.push("/volunteer/sign-up?shift=" + row.id)}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="border">
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )

}