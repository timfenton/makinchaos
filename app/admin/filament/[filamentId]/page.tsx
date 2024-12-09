import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import FilamentViewPage from '../_components/filament-view-page';

export const metadata = {
  title: 'Dashboard : Filament View'
};

type PageProps = Promise<{ params: { filamentId: string } }>;

export default async function Page({ params }: PageProps) {
  const searchParams = await params;
  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <FilamentViewPage filamentId={searchParams.filamentId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
