import PageContainer from '@/components/layout/page-container';
import { getMaterialTypes } from '@/lib/db/schema/materialTypes';
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
