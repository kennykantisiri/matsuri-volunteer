import Button from "@/app/components/Button";
import { Header } from "@/app/components/ui/text";
import { Shift } from "@/app/lib/types";
import { formatDateTable } from "@/app/lib/utils";
import { ConfirmWithLoading } from "../[cat]/ConfirmDialog";
import { useRouter } from "next/navigation";

interface Props {
    shift: Shift;
    onSuccess: () => void;
}

export default function ShiftCard({ shift, onSuccess }: Props) {

    const router = useRouter()

    return (
        <div className="flex flex-col gap-y-4 bg-white rounded-lg border p-4 mb-4">
            <Header className="text-xlg font-semibold mb-2">{shift.category.toUpperCase()}</Header>
            <div className="flex flex-col">
                <p className="text-sm text-muted-foreground mb-1"><b>Job:</b> {shift.job}</p>
                <p className="text-sm text-muted-foreground mb-1"><b>Date and Time:</b> {formatDateTable(shift.start, shift.end)}</p>
                <p className="text-sm text-muted-foreground mb-1"><b>Location:</b> {shift.attributes.location !== undefined ? shift.attributes.location : "Library Walk"}</p>
            </div>
            <ConfirmWithLoading onSuccess={onSuccess} shift={shift} initialSignedUp={true} attributes={shift.attributes} />
        </div>
    )
}