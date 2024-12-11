import { signIn } from '@/auth';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

export default function FacebookSignInButton() {
  return (
    <div className='text-center'>
      <form
        className=''
        action={async () => {
          "use server"
          await signIn("facebook")
        }}
      >
      <Button
        className="w-full max-w-[400px]"
        variant="outline"
        type="submit"
      >
        <Icons.facebook fill='#000' strokeOpacity={0} className="mr-2 h-4 w-4" />
        Continue with Facebook
      </Button>
      </form>
    </div>
  );
}
