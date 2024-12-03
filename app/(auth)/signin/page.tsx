import { Metadata } from 'next';
import SignInViewPage from '../_components/sigin-view';
import NextAuth from 'next-auth';
import authConfig from '@/auth.config';
import { redirectToUserDefaultPage } from '@/lib/utils';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Authentication | Sign In',
  description: 'Sign In page for authentication.'
};

const { auth } = NextAuth(authConfig);

export default async function Page() {
  const session = await auth();

  if(session?.user)
    return redirect(redirectToUserDefaultPage(session.user));

  return <SignInViewPage />;
}
