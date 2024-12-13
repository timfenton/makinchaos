import '../globals.css';
import AppHeader from './_components/header/app-header';

export default async function UserAppLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
        <AppHeader className='flex flex-col w-full bg-background items-center h-14' />
        <div className='flex justify-center items-center py-14'>
            <section className='flex-row w-11/12 md:w-2/3'>{children}</section>
        </div>
    </>
  );
}
