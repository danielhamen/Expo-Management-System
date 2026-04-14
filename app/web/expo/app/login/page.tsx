import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { InputField } from "@/components/ui/input-field";

export default function LoginPage() {
  return (
    <main className="mx-auto grid w-full max-w-md gap-6 px-4 py-[var(--theme-spacing-section)] sm:px-6">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-[var(--theme-text-secondary)]">
          Sign in to manage events, booths, and exhibitor workflows.
        </p>
      </header>

      <Card>
        <form className="grid gap-4" action="#" method="post">
          <InputField label="Email" type="email" placeholder="name@expo.com" required />
          <InputField label="Password" type="password" placeholder="••••••••" required />
          <div className="flex items-center justify-between text-sm">
            <label className="inline-flex items-center gap-2 text-[var(--theme-text-secondary)]">
              <input type="checkbox" className="h-4 w-4 rounded border-[var(--theme-border)]" />
              Keep me signed in
            </label>
            <a href="#" className="text-[var(--theme-brand)] hover:underline">
              Forgot password?
            </a>
          </div>
          <Button type="submit" leadingIcon={<Icon name="login" className="text-base" />}>
            Log in
          </Button>
        </form>
      </Card>

      <p className="text-center text-sm text-[var(--theme-text-secondary)]">
        New to Expo?{" "}
        <Link href="/signup" className="font-semibold text-[var(--theme-brand)] hover:underline">
          Create your account
        </Link>
        .
      </p>
    </main>
  );
}
