import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import FilamentGallery from "../_components/ui/FilamentGallery";

export default async function Page() {
    return (
        <>
            <div>
                <Card className="flex flex-col mx-auto w-full items-start p-4 md:p-8">
                    <CardHeader className='border-b border-muted-foreground w-full mb-10 gap-4'>
                        <CardTitle className="text-4xl text-center font-extrabold sparkle-text">
                            Available Colors
                        </CardTitle>
                        <CardDescription className="text-xl text-center">
                            Currently available colors are listed below, click a color to copy the name!
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="w-full p-0">
                        <FilamentGallery />
                    </CardContent>
                </Card>
            </div>
        </>
    )
}