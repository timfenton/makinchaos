import ClaimYourChaos  from "@/components/forms/claim-your-chaos";

export const metadata = {
    title: 'Claim your chaos'
};

export default async function Page() {
    
    return (
        <ClaimYourChaos pageTitle="Claim your Chaos" initialData={null}  />
    )
}