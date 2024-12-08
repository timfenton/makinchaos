import '../globals.css';
import AppHeader from './_components/header/app-header';

export default async function UserAppLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
        <AppHeader className='flex flex-col w-full bg-black items-center' />
        <div className='flex justify-center items-center py-14'>
            <section className='flex-row w-2/3'>{children}</section>
        </div>
    </>
  );
}
