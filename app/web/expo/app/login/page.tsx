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

type LoginResponse = {
  token: string;
  user: {
    id: string;
    email: string;
  };
};

export default function LoginPage() {
  const router = useRouter();
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
      const payload = await apiRequest<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      setStoredAuth({ token: payload.token, user: payload.user });
      router.push("/dashboard");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to log in");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto grid w-full max-w-md gap-6 px-4 py-[var(--theme-spacing-section)] sm:px-6">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-[var(--theme-text-secondary)]">
          Sign in to manage events, booths, and exhibitor workflows.
        </p>
      </header>

      <Card>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <InputField
            label="Email"
            type="email"
            placeholder="name@expo.com"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <InputField
            label="Password"
            type="password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {error ? <p className="text-sm text-[var(--theme-danger)]">{error}</p> : null}
          <Button type="submit" leadingIcon={<Icon name="login" className="text-base" />} disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Log in"}
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
