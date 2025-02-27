import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OrderForm from "./_components/order-form";

export const metadata = {
    title: 'Claim your chaos'
};

export default async function Page() {
    
    return (
        <>
            <div>
                <Card className="flex flex-col mx-auto w-full items-start px-8 pb-8">
                    <div className="flex flex-col w-full items-center">
                        <CardHeader className='border-b border-muted-foreground w-11/12 md:w-3/4 mb-10'>
                            <CardTitle className="text-4xl text-center font-extrabold sparkle-text">
                                {metadata.title}
                            </CardTitle>
                        </CardHeader>
                    </div>
                    <CardContent className='flex-row w-full'>
                            <OrderForm />
                    </CardContent>
                </Card>
            </div>
        </>
    )
}