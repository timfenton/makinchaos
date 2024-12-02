import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const session = await auth();

  console.log('found he session', session)

  if (!session?.user) {
    return redirect('/');
  } else {
    redirect('/admin/overview');
  }
}
