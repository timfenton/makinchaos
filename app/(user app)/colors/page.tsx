import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import FilamentGallery from "../_components/ui/FilamentGallery";
import { getMaterialTypes } from "@/lib/db/schema/materialTypes";

export default async function Page() {
    const materialTypes = await getMaterialTypes();

    return (
        <>
            <div>
                <Card className="flex flex-col mx-auto w-full items-start p-4 md:p-8">
                    <CardHeader className='border-b border-muted-foreground w-full mb-10 gap-4'>
                        <CardTitle className="text-4xl text-center font-extrabold sparkle-text">
                            Available Colors
                        </CardTitle>
                        <CardDescription className="text-xl text-center">
                            <span className="text-red-600">Please be aware</span> that 🌈 RAINBOW rolls work best on larger prints. 
                            <br />On shorter prints, such as rock climbing holds or even ramps, you may only get 1-2 random colors from the rainbow roll.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="w-full p-0">
                        <FilamentGallery materialTypes={materialTypes} />
                    </CardContent>
                </Card>
            </div>
        </>
    )
}