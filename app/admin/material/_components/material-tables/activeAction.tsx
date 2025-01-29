import { AlertModal } from "@/components/modal/alert-modal";
import { Badge } from "@/components/ui/badge";
import { SelectMaterial } from "@/lib/db/schema/materials";
import { useState } from "react";

interface ActiveActionProps {
    row: SelectMaterial;
    onConfirm: () => void;
}

const ActiveAction = ({ row, onConfirm }: ActiveActionProps) => {
    const [open, setOpen] = useState(false);

    return (
        <> 
            <AlertModal
                description={`This will ${row.isActive ? 'deactivate' : 'activate'} ${row.name}.`}
                variant="default"
                isOpen={open}
                onClose={() => {
                    setOpen(false);
                } }
                onConfirm={() => onConfirm()} 
                loading={false} />
            <Badge 
                onClick={() => setOpen(true)} 
                className={`${row.isActive ? "bg-green-500" : "bg-red-500"} cursor-pointer`}>
                {row.isActive ? "Active" : "Inactive"}
            </Badge>
        </>
    )
}

export default ActiveAction;