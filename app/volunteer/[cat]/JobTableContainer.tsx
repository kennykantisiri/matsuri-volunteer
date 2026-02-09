"use client"

import { useEffect, useMemo, useState } from "react"
import { JobTable, ShiftRow } from "./JobTable"
import { Shift } from "@/app/lib/types"
import { getFormattedAllSignups, getShifts, getUserStartTimestamps } from "@/app/lib/volunteer"

interface Props {
    data: Shift[];
}

export function JobTableContainer({ data }: Props) {
  const [userStartTimes, setUserStartTimes] = useState<number[]>([])
  const [userSignups, setUserSignups] = useState<any[]>([])
  const [allShiftSignups, setAllShiftSignups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true)

  async function refreshTable() {
    setLoading(true)

    const [userTimes, signups, allSignups] = await Promise.all([
      getUserStartTimestamps(),
      getShifts("user"),
      getFormattedAllSignups()
    ])

    setUserStartTimes(userTimes ?? [])
    setUserSignups(signups ?? [])
    setAllShiftSignups(allSignups ?? [])

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
      onRefresh={refreshTable}
    />
  )
}
