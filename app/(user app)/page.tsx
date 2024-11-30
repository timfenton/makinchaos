import { SearchParams } from "nuqs/parsers";

export const metadata = {
    title: 'Dashboard: Products'
};
  
type pageProps = {
    searchParams: SearchParams;
};

export default async function Page({ searchParams }: pageProps) {

}