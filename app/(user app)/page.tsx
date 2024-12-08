import ClaimYourChaos  from "@/app/(user app)/_components/forms/claim-your-chaos";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
    title: 'Claim your chaos'
};

export default async function Page() {
    
    return (
        <>
            <div>
                <Card className="flex flex-col mx-auto w-full items-start px-8 pb-8">
                    <div className="flex flex-col w-full items-center">
                        <CardHeader className='border-b border-muted-foreground w-3/4 mb-10'>
                            <CardTitle className="text-5xl text-center font-extrabold sparkle-text">
                                {metadata.title}
                            </CardTitle>
                        </CardHeader>
                    </div>
                    <CardContent className='flex-row w-full'>
                        <ClaimYourChaos />
                    </CardContent>
                </Card>
            </div>
        </>
    )
}