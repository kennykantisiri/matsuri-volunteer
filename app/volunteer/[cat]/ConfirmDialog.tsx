"use client"

import { useEffect, useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog"
import Button from "@/app/components/Button"
import { Shift } from "@/app/lib/types";
import { getShifts, signUp } from "@/app/lib/volunteer";
import { sign } from "crypto";

export interface ReserveShift {
    shift: Shift;
    initialSignedUp: boolean;
    attributes: any;
}


export function ConfirmWithLoading({ shift, initialSignedUp, attributes }: ReserveShift) {
  const [loading, setLoading] = useState(false);
  const [signedUp, setSignedUp] = useState(initialSignedUp);

  async function onSignUp() {

    setLoading(true);
    await signUp(shift);
    setLoading(false);
    setSignedUp(true);

    // setLoading(true)
    // await getUserShifts();
    // setLoading(false)
    // setStatus("awaiting")
  }


  return (
    <AlertDialog>

      {!signedUp ? (
          <AlertDialogTrigger asChild>
            <Button>Sign Up</Button>
          </AlertDialogTrigger>
      ) : 
        <AlertDialogTrigger asChild>
          <Button>Give Up</Button>
        </AlertDialogTrigger>
      }

      

      <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>
                Please confirm you want to take this shifts
            </AlertDialogTitle>
            <AlertDialogDescription>
                Job: {shift.job} <br/>
                Time: {shift.start.toLocaleString()} - {shift.end.toLocaleString()}
            </AlertDialogDescription> 
        </AlertDialogHeader>
        <AlertDialogFooter>
          {signedUp && (
            <AlertDialogCancel disabled={loading}>
              Cancel
            </AlertDialogCancel>
          )}

          {!signedUp ? (
            <AlertDialogAction
              onClick={onSignUp}
              disabled={loading}
            >
              {loading ? "Signing up..." : "Confirm"}
            </AlertDialogAction>
          ) : (
            <AlertDialogAction>Close</AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
