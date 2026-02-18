import Button from "@/app/components/Button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog"
import { ScrollArea } from "@/app/components/ui/scroll-area"
import { Separator } from "@/app/components/ui/separator"
import { Fragment } from "react"

interface Props {
    names: string[];
}

export function ViewOthers({ names }: Props) {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          {/* <Button variant="outline">Open Dialog</Button> */}
          <Button>View Others</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Others in this shift</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-72 w-full">
            <div className="p-4">
                {names.map((name) => (
                <Fragment key={name}>
                    <div className="text-sm">{name}</div>
                    <Separator className="my-2" />
                </Fragment>
                ))}
            </div>
        </ScrollArea>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
