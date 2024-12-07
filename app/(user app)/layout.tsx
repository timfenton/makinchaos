import { auth } from '@/auth';
import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/sonner';
import { Lato } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import '../globals.css';
import { NavigationMenu } from '@/components/ui/navigation-menu';
import AppHeader from './_components/header/app-header';

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  display: 'swap'
});

export default async function UserAppLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <>
        <AppHeader className='bg-black w-full max-w-full justify-start' />
        <div className='flex justify-center items-center pt-20'>
            <section className='flex-row w-[800]'>{children}</section>
        </div>
    </>
  );
}
