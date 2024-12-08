import { searchParamsCache } from '@/lib/searchparams';
import { DataTable as FilamentTable } from '@/components/ui/table/data-table';
import { columns } from './filament-tables/columns';
import { getFilaments, SelectFilament } from '@/lib/db/schema/filaments';

type FilamentListingPage = {};

export default async function FilamentListingPage({}: FilamentListingPage) {
  const search = searchParamsCache.get('q');
  const categories = searchParamsCache.get('categories');
  const tags = searchParamsCache.get('tags');

  const filters = {
    ...(search && { search }),
    ...(categories && { categories: categories }),
    ...(tags && { tags: tags })
  };

  const data = await getFilaments(filters);
  const totalFilaments = data.totalFilaments;
  const filaments: SelectFilament[] = data.data;

  return (
    <FilamentTable
      columns={columns}
      data={filaments}
      totalItems={totalFilaments}
    />
  );
}
