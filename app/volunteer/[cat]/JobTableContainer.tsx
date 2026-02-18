"use client"

import { useEffect, useMemo, useState } from "react"
import { JobTable, ShiftRow } from "./JobTable"
import { CategoryDetails, Shift } from "@/app/lib/types"
import { getAllShiftNames, getFormattedAllSignups, getShifts, getUserStartTimestamps } from "@/app/lib/volunteer"
import { getCategories, getCategoryDetails } from "@/app/lib/category"

interface Props {
    data: Shift[];
}

export function JobTableContainer({ data }: Props) {
  const [userStartTimes, setUserStartTimes] = useState<number[]>([])
  const [userSignups, setUserSignups] = useState<any[]>([])
  const [allShiftSignups, setAllShiftSignups] = useState<any[]>([]);
  const [allShiftNames, setAllShiftNames] = useState<string[]>([]);
  // const [allCategoryDetails, setAllCategoryDetails] = useState<CategoryDetails[]>([]);
  const [loading, setLoading] = useState(true)

  async function refreshTable() {
    setLoading(true)

    const [userTimes, signups, allSignups, allShiftNames] = await Promise.all([
      getUserStartTimestamps(),
      getShifts("user"),
      getFormattedAllSignups(),
      getAllShiftNames(true)
    ])

    // const categories = await getCategories();
    // const categoryDetailsAll = [];
    // for (const category of categories) {
    //   categoryDetailsAll.push(await getCategoryDetails(category))
    // }

    setUserStartTimes(userTimes ?? [])
    setUserSignups(signups ?? [])
    setAllShiftSignups(allSignups ?? [])
    setAllShiftNames(allShiftNames ?? [])
    // setAllCategoryDetails(categoryDetailsAll)

    setLoading(false)
  }

  useEffect(() => {
    refreshTable()
  }, [])

  const tableData: ShiftRow[] = useMemo(() => {
    return data.map(shift => ({
      ...shift,
      isConflict: userStartTimes.some(
        userStart => userStart === shift.start.getTime()
      ),
    }))
  }, [data, userStartTimes])

  

  return (
    <JobTable
      data={tableData}
      loading={loading}
      allShiftSignups={allShiftSignups}
      shiftSignups={userSignups}
      allShiftNames={allShiftNames}
      onRefresh={refreshTable}
    />
  )
}
