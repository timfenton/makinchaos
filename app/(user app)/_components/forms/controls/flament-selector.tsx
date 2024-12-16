'use client'

import { Button } from "@/components/ui/button";
import { getFilaments, SelectFilament } from "@/lib/db/schema/filaments";
import { useEffect, useState } from "react";
import FilamentCard from "./filament-card";

interface FilamentSelectorProps {
    preselectedFilamentIds: number[];
    setFilamentSelection: (ids: number[]) => void;
}

export default function FilamentSelector({ setFilamentSelection }: FilamentSelectorProps) {
    const [filaments, setFilaments] = useState<SelectFilament[]>();
    const [selectedFilaments, setSelectedFilaments] = useState<number[]>([]);

    const toggleFilamentSelected = (id: number) => {
        const filamentsCopy = [...selectedFilaments];

        if(selectedFilaments.includes(id))
        {
            const filtered = filamentsCopy.filter((x) => x !== id);
            setSelectedFilaments(filtered);
        } else {
            filamentsCopy.push(id);
            setSelectedFilaments(filamentsCopy)
        }
    }


    useEffect(() => {
        async function grabFilaments () {
            const response = await getFilaments();

            if(response.data)
                setFilaments(response.data);
        }

        grabFilaments();
    }, [])

    return filaments && (
        <div className="absolute top-0 left-0 w-full h-full bg-background flex flex-col p-4">
            <div className="grid grid-cols-3 lg:grid-cols-10 gap-2">
                {filaments.map((filament) => {
                    return <FilamentCard 
                                key={filament.id}
                                className={selectedFilaments.includes(filament.id) ? 'border-4 border-solid border-red-500' : ''} 
                                filament={filament} 
                                clickHandler={toggleFilamentSelected} />
                })}
            </div>
            <Button className="fixed bottom-5 left-5 w-1/4 justify-end" onClick={() => setFilamentSelection(selectedFilaments)}>
                Apply
            </Button> 
        </div>
    )
}