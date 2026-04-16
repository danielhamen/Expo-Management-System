"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { InputField } from "@/components/ui/input-field";
import { getStoredAuth } from "@/lib/auth";
import { apiRequest } from "@/lib/api";

type EventRecord = {
  id: string;
  title: string | null;
  desc: string | null;
  imageUrl: string | null;
  createdAt: string;
};

type BoothRecord = {
  id: string;
  name: string;
  desc: string | null;
  eventId: string;
  hidden: boolean;
};

export default function DashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [booths, setBooths] = useState<BoothRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [eventTitle, setEventTitle] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [eventImageUrl, setEventImageUrl] = useState("");
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);

  const [selectedEventId, setSelectedEventId] = useState("");
  const [boothName, setBoothName] = useState("");
  const [boothDesc, setBoothDesc] = useState("");
  const [isCreatingBooth, setIsCreatingBooth] = useState(false);

  const fetchEvents = useCallback(async (authToken: string) => {
    const payload = await apiRequest<EventRecord[]>("/events", { method: "GET" }, authToken);
    setEvents(payload);
    if (!selectedEventId && payload.length > 0) {
      setSelectedEventId(payload[0].id);
    }
    if (payload.length === 0) {
      setSelectedEventId("");
      setBooths([]);
    }
  }, [selectedEventId]);

  const fetchBooths = useCallback(async (authToken: string, eventId: string) => {
    if (!eventId) {
      setBooths([]);
      return;
    }

    const payload = await apiRequest<BoothRecord[]>(`/booths/event/${eventId}`, { method: "GET" }, authToken);
    setBooths(payload);
  }, []);

  useEffect(() => {
    const auth = getStoredAuth();
    if (!auth?.token) {
      router.replace("/login");
      return;
    }

    setToken(auth.token);

    const run = async () => {
      try {
        setError(null);
        await fetchEvents(auth.token);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    void run();
  }, [router, fetchEvents]);

  useEffect(() => {
    if (!token || !selectedEventId) {
      return;
    }

    const run = async () => {
      try {
        await fetchBooths(token, selectedEventId);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load booth data");
      }
    };

    void run();
  }, [token, selectedEventId, fetchBooths]);

  const metrics = useMemo(
    () => [
      { label: "My events", value: `${events.length}`, icon: "event_note", tone: "text-[var(--theme-brand)]" },
      { label: "Booths in selected event", value: `${booths.length}`, icon: "store", tone: "text-[var(--theme-success)]" },
      {
        label: "Hidden booths",
        value: `${booths.filter((booth) => booth.hidden).length}`,
        icon: "visibility_off",
        tone: "text-[var(--theme-warning)]",
      },
    ],
    [events, booths],
  );

  const handleCreateEvent = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) {
      return;
    }

    setIsCreatingEvent(true);
    setError(null);

    try {
      await apiRequest<EventRecord>(
        "/events",
        {
          method: "POST",
          body: JSON.stringify({
            title: eventTitle,
            desc: eventDesc || undefined,
            imageUrl: eventImageUrl || undefined,
          }),
        },
        token,
      );
      setEventTitle("");
      setEventDesc("");
      setEventImageUrl("");
      await fetchEvents(token);
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Unable to create event");
    } finally {
      setIsCreatingEvent(false);
    }
  };

  const handleCreateBooth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token || !selectedEventId) {
      return;
    }

    setIsCreatingBooth(true);
    setError(null);

    try {
      await apiRequest<BoothRecord>(
        "/booths",
        {
          method: "POST",
          body: JSON.stringify({
            eventId: selectedEventId,
            name: boothName,
            desc: boothDesc || undefined,
          }),
        },
        token,
      );
      setBoothName("");
      setBoothDesc("");
      await fetchBooths(token, selectedEventId);
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Unable to create booth");
    } finally {
      setIsCreatingBooth(false);
    }
  };

  if (isLoading) {
    return <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">Loading dashboard...</main>;
  }

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 sm:px-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Organizer dashboard</h1>
        <p className="text-sm text-[var(--theme-text-secondary)]">
          Data below is loaded from your account on the API server and filtered to your user.
        </p>
      </header>

      {error ? <p className="text-sm text-[var(--theme-danger)]">{error}</p> : null}

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
            <p className="text-sm text-[var(--theme-text-secondary)]">This persists to your user record in PostgreSQL.</p>
          </header>
          <form className="grid gap-3" onSubmit={handleCreateEvent}>
            <InputField label="Event name" placeholder="Global Tech Expo 2026" required value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} />
            <InputField label="Description" placeholder="Industry showcase" value={eventDesc} onChange={(e) => setEventDesc(e.target.value)} />
            <InputField label="Image URL" placeholder="https://..." value={eventImageUrl} onChange={(e) => setEventImageUrl(e.target.value)} />
            <Button type="submit" leadingIcon={<Icon name="add_circle" className="text-base" />} disabled={isCreatingEvent}>
              {isCreatingEvent ? "Creating..." : "Create event"}
            </Button>
          </form>
        </Card>

        <Card className="space-y-4">
          <header>
            <h2 className="text-lg font-semibold">Add booth inventory</h2>
            <p className="text-sm text-[var(--theme-text-secondary)]">Choose one of your events and save a booth.</p>
          </header>
          <form className="grid gap-3" onSubmit={handleCreateBooth}>
            <label className="grid gap-1.5 text-sm">
              <span className="font-medium">Event</span>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="h-11 rounded-[var(--theme-radius-md)] border border-[var(--theme-border)] bg-white px-3 text-sm"
                required
              >
                {events.length === 0 ? <option value="">No events yet</option> : null}
                {events.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title ?? "Untitled event"}
                  </option>
                ))}
              </select>
            </label>
            <InputField label="Booth name" placeholder="FutureStack Inc." required value={boothName} onChange={(e) => setBoothName(e.target.value)} />
            <InputField label="Booth description" placeholder="AI demos and giveaways" value={boothDesc} onChange={(e) => setBoothDesc(e.target.value)} />
            <Button type="submit" variant="secondary" leadingIcon={<Icon name="add_business" className="text-base" />} disabled={isCreatingBooth || !selectedEventId}>
              {isCreatingBooth ? "Saving..." : "Save booth"}
            </Button>
          </form>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 text-lg font-semibold">My events</h2>
          <ul className="space-y-2 text-sm">
            {events.length === 0 ? <li className="text-[var(--theme-text-secondary)]">No events found.</li> : null}
            {events.map((event) => (
              <li key={event.id} className="rounded-[var(--theme-radius-md)] bg-[var(--theme-surface-muted)] px-3 py-2">
                <p className="font-medium">{event.title ?? "Untitled event"}</p>
                <p className="text-[var(--theme-text-secondary)]">{event.desc ?? "No description"}</p>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h2 className="mb-3 text-lg font-semibold">Booths for selected event</h2>
          <ul className="space-y-2 text-sm">
            {booths.length === 0 ? <li className="text-[var(--theme-text-secondary)]">No booths found.</li> : null}
            {booths.map((booth) => (
              <li key={booth.id} className="rounded-[var(--theme-radius-md)] bg-[var(--theme-surface-muted)] px-3 py-2">
                <p className="font-medium">{booth.name}</p>
                <p className="text-[var(--theme-text-secondary)]">{booth.desc ?? "No description"}</p>
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </main>
  );
}
