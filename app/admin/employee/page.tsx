import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs';
import React from 'react';
import EmployeeListingPage from './_components/employee-listing-page';

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export const metadata = {
  title: 'Dashboard : Employees'
};

export default async function Page({ searchParams }: pageProps) {
  // Allow nested RSCs to access the search params (in a type-safe way)
  await searchParamsCache.parse(searchParams);

  return <EmployeeListingPage />;
}
