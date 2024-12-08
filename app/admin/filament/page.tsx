import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { searchParamsCache, serialize } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { SearchParams } from 'nuqs';
import { Suspense } from 'react';
import FilamentListingPage from './_components/filament-listing';
import FilamentTableAction from './_components/filament-tables/filament-table-action';

export const metadata = {
  title: 'Dashboard: Filament'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page({ searchParams }: pageProps) {
  // Allow nested RSCs to access the search params (in a type-safe way)
  await searchParamsCache.parse((await searchParams));

  // This key is used for invoke suspense if any of the search params changed (used for filters).
  const key = serialize({ ...(await searchParams) });

  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Filament"
            description="Manage filaments"
          />
          <Link
            href="/admin/filament/new"
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />
        <FilamentTableAction />
        <Suspense
          key={key}
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <FilamentListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
