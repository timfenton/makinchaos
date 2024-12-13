import { Card } from "@/components/ui/card";
import FilamentSelector from "../_components/forms/controls/flament-selector";

export default async function Page() {

    const setFilmanetSelection = async (ids: number[]) => {
        'use server'
        console.log('selections', ids);
    }
    
    return (
        <>
            <div>
                <Card className="flex flex-col mx-auto w-full items-start px-8 pb-8">
                    <FilamentSelector preselectedFilamentIds={[]} setFilamentSelection={setFilmanetSelection} />
                </Card>
            </div>
        </>
    )
}