import { notFound } from 'next/navigation';
import FilamentForm from './filament-form';
import { getFilamentById, SelectFilament } from '@/lib/db/schema/filaments';
import { NextResponse } from 'next/server';

type TFilamentViewPageProps = {
  filamentId: string;
};

export default async function FilamentViewPage({
  filamentId
}: TFilamentViewPageProps) {
  let filament = null;
  let pageTitle = 'Create New Filament';

  if (filamentId !== 'new') {
    const data = await getFilamentById(filamentId);

    if(!data.found)
      NextResponse.error();

    filament = data.data as SelectFilament;

    if (!filament) {
      notFound();
    }
    pageTitle = `Edit Filament`;
  }

  return <FilamentForm initialData={filament} pageTitle={pageTitle} />;
}
