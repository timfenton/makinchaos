import { SearchParams } from 'nuqs';
import ProfileViewPage from './_components/profile-view-page';

type pageProps = {
  params: Promise<SearchParams>
};

export const metadata = {
  title: 'Dashboard : Profile'
};

export default async function Page({ params }: pageProps) {
  return <ProfileViewPage />;
}
