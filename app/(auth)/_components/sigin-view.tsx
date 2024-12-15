import { Metadata } from 'next';
import Link from 'next/link';
import UserAuthForm from './user-auth-form';
import ChaosLogo from '@/app/(user app)/_components/logo';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.'
};

export default function SignInViewPage() {
  return (
    <div className="relative h-screen flex-col items-center justify-center lg:max-w-none lg:grid lg:grid-cols-2 lg:px-0">
      <div className="flex relative flex-row bg-muted p-6 gap-10 text-white dark:border-r w-full lg:flex-col lg:h-full lg:p-10 lg:items-start">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <ChaosLogo linkHref='/signin' />
        </div>
        <div className="relative z-20 mt-auto w-full lg:w-auto text-right lg:text-left">
          
        </div>
      </div>
      <div className="flex h-auto md:h-full items-right p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] lg:w-[1000px] pt-20 lg:pt-0">
          <div className="flex flex-col space-y-2 text-center mb-10">
            <blockquote className="space-y-2">
              <p className="text-2xl font-extrabold">
                Welcome to makinchaos.com! 
              </p>
              <p className="text-xl">
                Here to claim your chaos or order custom chaos? You&apos;ve come to the right place,
                just signin with Facebook and submit the form!
              </p>
              <footer className="text-sm">- Trina</footer>
            </blockquote>
          </div>
          <UserAuthForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{' '}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
