import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { InputField } from "@/components/ui/input-field";

const metrics = [
  { label: "Active events", value: "4", icon: "event_note", tone: "text-[var(--theme-brand)]" },
  { label: "Booths reserved", value: "72", icon: "store", tone: "text-[var(--theme-success)]" },
  { label: "Pending approvals", value: "11", icon: "pending_actions", tone: "text-[var(--theme-warning)]" },
];

export default function DashboardPage() {
  return (
    <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 sm:px-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Organizer dashboard</h1>
        <p className="text-sm text-[var(--theme-text-secondary)]">
          Create events, configure booth inventory, and monitor readiness across your expo portfolio.
        </p>
      </header>

      <section aria-label="Key metrics" className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.label} className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-[var(--theme-text-secondary)]">{metric.label}</p>
              <p className="text-2xl font-bold">{metric.value}</p>
            </div>
            <Icon name={metric.icon} className={`text-3xl ${metric.tone}`} />
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-4">
          <header>
            <h2 className="text-lg font-semibold">Create a new event</h2>
            <p className="text-sm text-[var(--theme-text-secondary)]">Spin up a draft in under a minute.</p>
          </header>
          <form className="grid gap-3" action="#" method="post">
            <InputField label="Event name" placeholder="Global Tech Expo 2026" required />
            <div className="grid gap-3 sm:grid-cols-2">
              <InputField label="Start date" type="date" required />
              <InputField label="End date" type="date" required />
            </div>
            <InputField label="Venue" placeholder="San Francisco Convention Center" required />
            <Button type="submit" leadingIcon={<Icon name="add_circle" className="text-base" />}>
              Create event
            </Button>
          </form>
        </Card>

        <Card className="space-y-4">
          <header>
            <h2 className="text-lg font-semibold">Add booth inventory</h2>
            <p className="text-sm text-[var(--theme-text-secondary)]">Keep booth assignments structured and searchable.</p>
          </header>
          <form className="grid gap-3" action="#" method="post">
            <InputField label="Booth code" placeholder="A-14" required />
            <div className="grid gap-3 sm:grid-cols-2">
              <InputField label="Zone" placeholder="Innovation Hall" required />
              <InputField label="Size (sq ft)" type="number" min={10} placeholder="120" required />
            </div>
            <InputField label="Sponsor / exhibitor" placeholder="FutureStack Inc." />
            <Button type="submit" variant="secondary" leadingIcon={<Icon name="add_business" className="text-base" />}>
              Save booth
            </Button>
          </form>
        </Card>
      </section>
    </main>
  );
}
