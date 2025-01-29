import PageContainer from '@/components/layout/page-container';
import { getMaterialTypes, MaterialType } from '@/lib/db/schema/materialTypes';
import { Suspense } from 'react';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import MaterialListing from './_components/material-types-listing';

export const metadata = {
  title: 'Dashboard: Material Types'
};

type SearchParams = { [key: string]: string | string[] | undefined }

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const materialTypes = await getMaterialTypes();

  return (
    <PageContainer>
        <MaterialListing data={materialTypes} />
    </PageContainer>
  );
}
