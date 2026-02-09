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
import { useRouter } from "next/navigation";
import { getShifts, signUp, giveUp } from "@/app/lib/volunteer";

export interface ReserveShift {
    shift: Shift;
    initialSignedUp: boolean;
    attributes: any;
    onSuccess?: () => void;
}


export function ConfirmWithLoading({ shift, initialSignedUp, attributes, onSuccess = () => {} }: ReserveShift) {
  const [loading, setLoading] = useState(false);
  const [signedUp, setSignedUp] = useState(initialSignedUp);
  const router = useRouter();

  async function onSignUp() {
    setLoading(true);
    await signUp(shift);
    setLoading(false);
    setSignedUp(true);
    onSuccess();
  }

  async function onGiveUp() {
    setLoading(true);
    await giveUp(shift);
    setLoading(false);
    setSignedUp(false);
    onSuccess();
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
          {signedUp ? (
            <>
             <AlertDialogTitle>
              Please confirm you want to give up this shift
              </AlertDialogTitle>
              <AlertDialogDescription>
              Job: {shift.job} <br/>
              Time: {shift.start.toLocaleString()} - {shift.end.toLocaleString()}
              </AlertDialogDescription> 
            </>
          ) : (
            <>
             <AlertDialogTitle>
              Please confirm you want to take this shifts
              </AlertDialogTitle>
              <AlertDialogDescription>
              Job: {shift.job} <br/>
              Time: {shift.start.toLocaleString()} - {shift.end.toLocaleString()}
              </AlertDialogDescription> 
            </>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
           <AlertDialogCancel disabled={loading}>
              Cancel
          </AlertDialogCancel>

          {!signedUp ? (
            <AlertDialogAction
              onClick={onSignUp}
              disabled={loading}
            >
              {loading ? "Signing up..." : "Confirm"}
            </AlertDialogAction>
          ) : (
            <AlertDialogAction
              onClick={onGiveUp}
              disabled={loading}
            >
              {loading ? "Giving Up..." : "Give Up"}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
