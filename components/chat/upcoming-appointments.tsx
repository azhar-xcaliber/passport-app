"use client";

import { format, parseISO } from "date-fns";
import { CalendarIcon, ClockIcon, StethoscopeIcon, UserIcon } from "lucide-react";
import { useActiveChat } from "@/hooks/use-active-chat";

type Appointment = {
  id: string;
  date: string;
  time: string;
  displayTime: string;
  provider: string;
  type: string;
  status: "booked" | "confirmed" | "pending";
  location: string;
};

type DaySlots = {
  date: string;
  slots: unknown[];
};

type UpcomingAppointmentsData = {
  patientId: string;
  patientName: string;
  upcomingAppointments: Appointment[];
  availableSlots: DaySlots[];
};

const STATUS_COLORS: Record<string, string> = {
  confirmed:
    "bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-400",
  booked:
    "bg-sky-500/10 text-sky-600 ring-1 ring-sky-500/20 dark:text-sky-400",
  pending:
    "bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20 dark:text-amber-400",
};

export function UpcomingAppointments({
  data,
}: {
  data: UpcomingAppointmentsData;
}) {
  const { sendMessage, isReadonly } = useActiveChat();

  const handleDateSelect = (dateStr: string) => {
    if (isReadonly) return;
    const label = format(parseISO(dateStr), "EEEE, MMMM d");
    sendMessage({
      role: "user",
      parts: [{ type: "text", text: `I'd like to schedule on ${label}` }],
    });
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-(--shadow-float)">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border/30 bg-muted/50 px-4 py-3">
        <div className="flex size-7 items-center justify-center rounded-lg bg-background ring-1 ring-border/50">
          <StethoscopeIcon className="text-muted-foreground" size={14} />
        </div>
        <div>
          <div className="font-semibold text-foreground text-sm leading-none">
            Appointments
          </div>
          <div className="mt-0.5 flex items-center gap-1 text-muted-foreground text-xs">
            <UserIcon size={10} />
            {data.patientName}
          </div>
        </div>
      </div>

      {/* Upcoming appointments */}
      {data.upcomingAppointments.length > 0 && (
        <div className="divide-y divide-border/30">
          {data.upcomingAppointments.map((appt) => (
            <div
              className="flex items-center justify-between px-4 py-3"
              key={appt.id}
            >
              <div className="flex items-center gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/60 ring-1 ring-border/30">
                  <ClockIcon className="text-muted-foreground" size={13} />
                </div>
                <div>
                  <div className="font-medium text-foreground text-xs">
                    {format(parseISO(appt.date), "EEE, MMM d")} · {appt.displayTime}
                  </div>
                  <div className="text-muted-foreground/70 text-[11px]">
                    {appt.provider} · {appt.type}
                  </div>
                </div>
              </div>
              <span
                className={[
                  "rounded-full px-2 py-0.5 font-medium text-[10px] capitalize",
                  STATUS_COLORS[appt.status] ?? STATUS_COLORS.pending,
                ].join(" ")}
              >
                {appt.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Schedule new section */}
      {data.availableSlots.length > 0 && (
        <div className="border-t border-border/30 px-4 py-3">
          <div className="mb-2 flex items-center gap-1.5 text-muted-foreground/70 text-[11px] font-medium uppercase tracking-wider">
            <CalendarIcon size={10} />
            Pick a date to schedule
          </div>
          <div className="flex gap-2 overflow-x-auto pb-0.5">
            {data.availableSlots.map((day) => (
              <button
                className={[
                  "shrink-0 rounded-xl border px-3 py-2 text-center text-xs transition-colors",
                  isReadonly
                    ? "cursor-default border-border/30 bg-muted/20 opacity-50"
                    : "cursor-pointer border-border/50 bg-card/30 hover:border-primary/40 hover:bg-primary/5 hover:text-primary",
                ].join(" ")}
                disabled={isReadonly}
                key={day.date}
                onClick={() => handleDateSelect(day.date)}
                type="button"
              >
                <div className="font-semibold text-foreground">
                  {format(parseISO(day.date), "EEE")}
                </div>
                <div className="text-muted-foreground text-[10px]">
                  {format(parseISO(day.date), "MMM d")}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {data.upcomingAppointments.length === 0 &&
        data.availableSlots.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 px-4 py-8 text-center">
            <CalendarIcon className="text-muted-foreground/20" size={28} />
            <p className="text-muted-foreground/60 text-xs">
              No upcoming appointments or available slots
            </p>
          </div>
        )}
    </div>
  );
}
