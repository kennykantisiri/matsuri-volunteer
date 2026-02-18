"use client"

import { useRouter } from "next/navigation";
import { getCategories } from "@/app/lib/category";
import { ArrowUpDown } from "lucide-react"
import { cn } from "@/app/lib/utils";

import {
    ColumnDef,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    ColumnFiltersState,
    getFilteredRowModel,
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
import { CategoryDetails, Shift } from "@/app/lib/types";
import { checkSameCalendarDay } from "../ClickableCategory";
import Button from "@/app/components/Button";
import { Input } from "@/app/components/ui/input"
import React, { act, useEffect, useMemo, useState } from "react";
import { ConfirmWithLoading } from "./components/ConfirmDialog";
import { getShifts, getUserStartTimestamps } from "@/app/lib/volunteer";
import { formatDateTable } from "@/app/lib/utils";
import { ViewOthers } from "./components/ViewOthers";
import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs";


interface ShiftProps {
    data: ShiftRow[]
    loading: boolean
    shiftSignups: any[]
    allShiftNames: any[]
    // allCategoryDetails: CategoryDetails[]
    allShiftSignups: Shift[]
    onRefresh: () => void
  }

export type ShiftRow = Shift & {
    isConflict: boolean;
}

function getAvailability(shift: Shift, allSignups: Shift[]) {
    const countSignedUp = allSignups.filter(
        signup => signup.id === shift.id
      ).length;
    
      let totalAvailability = 0;
    
      if (typeof shift.totalAvailability === "number") {
        totalAvailability = shift.totalAvailability;
      } else if (typeof shift.totalAvailability === "object") {
        totalAvailability = Object.values(shift.totalAvailability).reduce(
          (sum: number, value) => sum + (typeof value === "number" ? value : 0),
          0
        );
      }
    
      return {
        current: totalAvailability - countSignedUp,
        total: totalAvailability,
      };
}

function prettyDay(dayKey: number) {
    return new Date(dayKey).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
    });
}



export function JobTable({ data, loading, allShiftSignups, allShiftNames, shiftSignups, onRefresh }: ShiftProps) {

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
      )

      let daysSeperate: any = [];

    data.forEach(shift => {
        if (!shift.id.startsWith("cleanup")) {
            const d = new Date(shift.start);
            d.setHours(0, 0, 0, 0); // normalize to day
            const key = d.getTime(); // math-friendly number
        
            if (!daysSeperate.includes(key)) {
                daysSeperate.push(key);
            }
        }
    });

    const orderedDaysSeperate = [...daysSeperate].sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    const [activeTab, setActiveTab] = useState(orderedDaysSeperate[0]);

      const filteredData = useMemo(() => {
        
        if (activeTab != null) {
            return data.filter(shift => {
                const d = new Date(shift.start);
                d.setHours(0, 0, 0, 0); // normalize to day
                const key = d.getTime();

                if (key == activeTab) {
                    return true;
                }
            })
        }

        return data;
    
    }, [data, activeTab]);    

    const columns: ColumnDef<ShiftRow>[] = [
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
            header: ({ column }) => {
                return (
                    <div className="flex flex-row items-center">
                        <p>Time</p>
                        <ArrowUpDown 
                            className="ml-2 h-4 w-4 cursor-pointer text-muted-foreground" 
                            onClick={() => {
                                column.toggleSorting(column.getIsSorted() === "asc");
                            }} />
                    </div>
                )
            },
            accessorFn: shift => `${formatDateTable(shift.start, shift.end)}`,
            // accessorFn: shift => `${formatDateTable(shift)}`,
        },
        {
            accessorKey: "totalAvailability",
            header: "Availability",
            accessorFn: shift => {
                const { current, total } = getAvailability(shift, allShiftSignups);
                return `${current} / ${total}`;
            }
        },
        {
            id: "action",
            header: "",
            cell: ( { row } ) => {

                const shiftCur = row.original;
                const initialSignedUp = shiftSignups.some((signup) => signup.shift_id === shiftCur.id);
                const { current } = getAvailability(shiftCur, allShiftSignups);
                const isFull = current <= 0;

                const shiftNamesSignedUp = allShiftNames
                    .filter((shiftWithName) => shiftWithName.shift_id === shiftCur.id)
                    .map((shiftWithName) => shiftWithName.first_name + " " + shiftWithName.last_name)
                
                return (
                    <div className="flex gap-x-3">
                        {loading ? (
                            <Button disabled>Loading...</Button>
                            ) : initialSignedUp ? (
                            <ConfirmWithLoading
                                shift={shiftCur}
                                initialSignedUp={initialSignedUp}
                                onSuccess={onRefresh}
                                attributes=""
                            />
                            ) : isFull ? (
                            <Button disabled className="bg-gray-400 cursor-not-allowed">
                                Shift Full
                            </Button>
                            ) : row.original.isConflict ? (
                            <Button disabled>Conflict</Button>
                            ) : (
                            <ConfirmWithLoading
                                shift={shiftCur}
                                initialSignedUp={initialSignedUp}
                                onSuccess={onRefresh}
                                attributes=""
                            />
                            )}

                        <ViewOthers names={shiftNamesSignedUp} />
                       
                    </div>
                )
            }
        }
    ]

    const table = useReactTable({ 
        data: filteredData, 
        columns, 
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
            columnFilters
        }, 
    });
    
    return (
        !loading ? 
            (
            <div className="flex flex-col gap-y-5">

                {orderedDaysSeperate.length > 1 
                ? (<Tabs onValueChange={(v) => setActiveTab(v)} defaultValue={orderedDaysSeperate[0]} className="w-[400px]">
                    <TabsList>
                        {orderedDaysSeperate.map((day: any) => (
                            <TabsTrigger key={day} value={day}>{prettyDay(day)}</TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>)
                : <></>}

                {/* <div className="flex items-center py-4">
                        <Input
                            placeholder="Filter Jobs..."
                            value={(table.getColumn("location")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn("location")?.setFilterValue(event.target.value)
                            }
                            className="max-w-sm"
                        />
                    </div> */}

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
                                    className={cn("even:bg-muted/70", 
                                        row.original.isConflict && "!bg-red-50",
                                        (getAvailability(row.original, allShiftSignups).current <= 0) && "!bg-red-50",
                                        shiftSignups.some((signup) => signup.shift_id === row.original.id) && "!bg-green-50"
                                    )}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                    <TableCell className="p-6" key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                    ))}
                                </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                <TableCell className="h-24 text-center p-4" colSpan={columns.length} >
                                    No results.
                                </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div> 
            </div>)  : <div>Loading...</div> 
        );
    
}