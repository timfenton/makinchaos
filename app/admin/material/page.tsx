import PageContainer from '@/components/layout/page-container';
import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs';
import { getMaterials, MaterialFilters, MaterialWithTypes, SortBy } from '@/lib/db/schema/materials';
import MaterialListing from './_components/material-listing'
import { getMaterialTypes } from '@/lib/db/schema/materialTypes';

export const metadata = {
  title: 'Dashboard: Material'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page({ searchParams }: pageProps) {
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse((await searchParams));

  const search = searchParamsCache.get('q');
  const categories = searchParamsCache.get('categories');
  const tags = searchParamsCache.get('tags');
  const sort = searchParamsCache.get('sort');
  const dir = searchParamsCache.get('dir');
  const materialType = searchParamsCache.get('materialType');

  const filters: MaterialFilters = {
    ...(search && { search }),
    ...(categories && { categories: categories }),
    ...(tags && { tags: tags }),
    ...(materialType && { materialType: materialType})
  };

  const sortBy: SortBy | undefined = sort ? {
    column: sort,
    dir: dir ?? undefined,
  } : undefined;

  const response = await getMaterials(filters, sortBy);
  const materials: MaterialWithTypes[] = response.data;

  const materialTypes = await getMaterialTypes();

  return (
    <PageContainer>
      <MaterialListing data={materials} filters={filters} sortBy={sortBy} materialTypes={materialTypes} />
    </PageContainer>
  );
}
