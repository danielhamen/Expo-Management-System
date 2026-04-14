import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { InputField } from "@/components/ui/input-field";

export default function SignupPage() {
  return (
    <main className="mx-auto grid w-full max-w-lg gap-6 px-4 py-[var(--theme-spacing-section)] sm:px-6">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Create your Expo account</h1>
        <p className="text-sm text-[var(--theme-text-secondary)]">
          Start building events and assign booths with role-ready tools.
        </p>
      </header>

      <Card>
        <form className="grid gap-4" action="#" method="post">
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField label="First name" placeholder="Jordan" required />
            <InputField label="Last name" placeholder="Lee" required />
          </div>
          <InputField label="Work email" type="email" placeholder="team@expo.com" required />
          <InputField label="Organization" placeholder="Expo Management Co." required />
          <InputField
            label="Password"
            type="password"
            placeholder="At least 8 characters"
            helperText="Use one uppercase letter and one number for stronger security."
            required
          />
          <Button type="submit" leadingIcon={<Icon name="app_registration" className="text-base" />}>
            Sign up
          </Button>
        </form>
      </Card>

      <p className="text-center text-sm text-[var(--theme-text-secondary)]">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[var(--theme-brand)] hover:underline">
          Log in
        </Link>
        .
      </p>
    </main>
  );
}
