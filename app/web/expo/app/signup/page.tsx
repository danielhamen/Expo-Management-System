"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { InputField } from "@/components/ui/input-field";
import { getStoredAuth, setStoredAuth } from "@/lib/auth";
import { apiRequest } from "@/lib/api";

type SignupResponse = {
  token: string;
  user: {
    id: string;
    email: string;
  };
};

export default function SignupPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const auth = getStoredAuth();
    if (auth) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const name = `${firstName} ${lastName} (${organization})`.trim();
      const payload = await apiRequest<SignupResponse>("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password, name }),
      });
      setStoredAuth({ token: payload.token, user: payload.user });
      router.push("/dashboard");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to sign up");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto grid w-full max-w-lg gap-6 px-4 py-[var(--theme-spacing-section)] sm:px-6">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Create your Expo account</h1>
        <p className="text-sm text-[var(--theme-text-secondary)]">
          Start building events and assign booths with role-ready tools.
        </p>
      </header>

      <Card>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField label="First name" placeholder="Jordan" required value={firstName} onChange={(event) => setFirstName(event.target.value)} />
            <InputField label="Last name" placeholder="Lee" required value={lastName} onChange={(event) => setLastName(event.target.value)} />
          </div>
          <InputField label="Work email" type="email" placeholder="team@expo.com" required value={email} onChange={(event) => setEmail(event.target.value)} />
          <InputField label="Organization" placeholder="Expo Management Co." required value={organization} onChange={(event) => setOrganization(event.target.value)} />
          <InputField
            label="Password"
            type="password"
            placeholder="At least 8 characters"
            helperText="Use one uppercase letter and one number for stronger security."
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {error ? <p className="text-sm text-[var(--theme-danger)]">{error}</p> : null}
          <Button type="submit" leadingIcon={<Icon name="app_registration" className="text-base" />} disabled={isSubmitting}>
            {isSubmitting ? "Signing up..." : "Sign up"}
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
