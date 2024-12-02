import { signIn } from '@/auth';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

export default function FacebookSignInButton() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("facebook")
      }}
    >
    <Button
      className="w-full"
      variant="outline"
      type="submit"
    >
      <Icons.facebook fill='#000' strokeOpacity={0} className="mr-2 h-4 w-4" />
      Continue with Facebook
    </Button>
    </form>
  );
}
