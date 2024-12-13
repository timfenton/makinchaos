'use client'

import { SelectFilament } from "@/lib/db/schema/filaments";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface FilamentCardProps {
    className: string;
    filament: SelectFilament;
    clickHandler: (id: number) => void;
}

export default function FilamentSelector({ className, filament, clickHandler }: FilamentCardProps) {
    return (
        <div className={cn(className)} onClick={() => clickHandler(filament.id)}>
            <Image
                src={filament.imageUrl}
                alt={filament.name}
                layout="intrinsic"
                objectFit="cover"
                style={{ objectPosition: 'center' }}
                width={100}
                height={100}
            />
        </div>
    )
}