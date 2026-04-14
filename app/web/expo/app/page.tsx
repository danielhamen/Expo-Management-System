import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";

const highlights = [
  {
    title: "Event operations",
    description: "Coordinate schedules, capacity, and run-of-show in a single control center.",
    icon: "event_available",
  },
  {
    title: "Booth management",
    description: "Track booth assignments, sponsor tiers, and setup requirements by zone.",
    icon: "storefront",
  },
  {
    title: "Team collaboration",
    description: "Keep organizers aligned with role-based dashboards and status updates.",
    icon: "groups",
  },
];

export default function Home() {
  return (
    <main>
      <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-[var(--theme-spacing-section)] sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div className="space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full bg-[var(--theme-brand-muted)] px-3 py-1 text-sm font-medium text-[var(--theme-brand)]">
            <Icon name="rocket_launch" className="text-base" />
            Expo MVP Platform
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Run every expo workflow from one scalable dashboard.
          </h1>
          <p className="max-w-prose text-base text-[var(--theme-text-secondary)] sm:text-lg">
            Start with authentication, event setup, and booth planning now. Expand into ticketing, analytics,
            and CRM integrations later without reworking your UI foundation.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/signup">
              <Button leadingIcon={<Icon name="person_add" className="text-base" />}>Create account</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="secondary" leadingIcon={<Icon name="dashboard" className="text-base" />}>
                View dashboard
              </Button>
            </Link>
          </div>
        </div>

        <Card className="space-y-4">
          <h2 className="text-lg font-semibold">Today&apos;s pulse</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center justify-between rounded-[var(--theme-radius-md)] bg-[var(--theme-surface-muted)] px-3 py-2">
              <span>Registered attendees</span>
              <strong>1,287</strong>
            </li>
            <li className="flex items-center justify-between rounded-[var(--theme-radius-md)] bg-[var(--theme-surface-muted)] px-3 py-2">
              <span>Booths confirmed</span>
              <strong>72 / 90</strong>
            </li>
            <li className="flex items-center justify-between rounded-[var(--theme-radius-md)] bg-[var(--theme-surface-muted)] px-3 py-2">
              <span>Open action items</span>
              <strong>14</strong>
            </li>
          </ul>
        </Card>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-4 px-4 pb-[var(--theme-spacing-section)] sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        {highlights.map((item) => (
          <Card key={item.title}>
            <h3 className="mb-2 inline-flex items-center gap-2 text-base font-semibold">
              <Icon name={item.icon} className="text-[var(--theme-brand)]" />
              {item.title}
            </h3>
            <p className="text-sm text-[var(--theme-text-secondary)]">{item.description}</p>
          </Card>
        ))}
      </section>
    </main>
  );
}
