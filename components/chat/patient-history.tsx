"use client";

import { CalendarIcon, MapPinIcon, StethoscopeIcon, UserIcon } from "lucide-react";
import { useActiveChat } from "@/hooks/use-active-chat";

type VisitRecord = {
  date: string;
  doctor: string;
  location: string;
  reason: string;
};

type PatientHistoryData = {
  patientId: string;
  patientName: string;
  isReturning: boolean;
  lastDoctor: string | null;
  lastDoctorId: string | null;
  lastLocation: string | null;
  lastLocationId: string | null;
  visitHistory: VisitRecord[];
};

export function PatientHistory({ data }: { data: PatientHistoryData }) {
  const { sendMessage, isReadonly } = useActiveChat();

  const handleSameDoctorAndLocation = () => {
    if (isReadonly) return;
    sendMessage({
      role: "user",
      parts: [
        {
          type: "text",
          text: `I'd like to see the same doctor at the same location`,
        },
      ],
    });
  };

  const handleChooseDifferent = () => {
    if (isReadonly) return;
    sendMessage({
      role: "user",
      parts: [
        {
          type: "text",
          text: "I'd like to choose a different location or doctor",
        },
      ],
    });
  };

  if (!data.isReturning) {
    return (
      <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-(--shadow-float)">
        <div className="flex items-center gap-2 border-b border-border/30 bg-muted/50 px-4 py-3">
          <div className="flex size-7 items-center justify-center rounded-lg bg-background ring-1 ring-border/50">
            <UserIcon className="text-muted-foreground" size={14} />
          </div>
          <div>
            <div className="font-semibold text-foreground text-sm leading-none">
              New Patient
            </div>
            <div className="mt-0.5 text-muted-foreground text-xs">{data.patientName}</div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 px-4 py-6 text-center">
          <StethoscopeIcon className="text-muted-foreground/20" size={28} />
          <p className="font-medium text-foreground text-sm">Welcome!</p>
          <p className="text-muted-foreground/70 text-xs">
            No previous visits on record. Let&apos;s find you a clinic location.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-(--shadow-float)">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border/30 bg-muted/50 px-4 py-3">
        <div className="flex size-7 items-center justify-center rounded-lg bg-background ring-1 ring-border/50">
          <StethoscopeIcon className="text-muted-foreground" size={14} />
        </div>
        <div>
          <div className="font-semibold text-foreground text-sm leading-none">
            Visit History
          </div>
          <div className="mt-0.5 flex items-center gap-1 text-muted-foreground text-xs">
            <UserIcon size={10} />
            {data.patientName}
          </div>
        </div>
      </div>

      {/* Last visit summary */}
      {data.lastDoctor && data.lastLocation && (
        <div className="border-b border-border/30 px-4 py-3">
          <div className="mb-1.5 text-muted-foreground/70 text-[11px] font-medium uppercase tracking-wider">
            Last seen
          </div>
          <div className="flex items-center gap-2 text-xs">
            <StethoscopeIcon className="text-muted-foreground/60 shrink-0" size={11} />
            <span className="font-medium text-foreground">{data.lastDoctor}</span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs">
            <MapPinIcon className="text-muted-foreground/60 shrink-0" size={11} />
            <span className="text-muted-foreground">{data.lastLocation}</span>
          </div>
        </div>
      )}

      {/* Visit history list */}
      {data.visitHistory.length > 0 && (
        <div className="divide-y divide-border/30">
          {data.visitHistory.slice(0, 3).map((visit, i) => (
            <div className="flex items-center gap-3 px-4 py-2.5" key={i}>
              <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted/50 ring-1 ring-border/30">
                <CalendarIcon className="text-muted-foreground/60" size={12} />
              </div>
              <div>
                <div className="font-medium text-foreground text-xs">
                  {visit.reason}
                </div>
                <div className="text-muted-foreground/60 text-[11px]">
                  {visit.date} · {visit.doctor}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action buttons */}
      <div className="border-t border-border/30 p-3">
        <div className="mb-1.5 text-muted-foreground/70 text-[11px] font-medium uppercase tracking-wider">
          Book with
        </div>
        <div className="flex flex-col gap-2">
          <button
            className={[
              "rounded-xl border px-3.5 py-2.5 text-left text-xs font-medium transition-colors",
              isReadonly
                ? "cursor-default border-border/30 bg-muted/20 opacity-50 text-muted-foreground"
                : "cursor-pointer border-primary/30 bg-primary/5 text-primary hover:bg-primary/10",
            ].join(" ")}
            disabled={isReadonly}
            onClick={handleSameDoctorAndLocation}
            type="button"
          >
            <div>{data.lastDoctor} at {data.lastLocation}</div>
            <div className="mt-0.5 font-normal text-[10px] opacity-70">Same doctor &amp; location as last visit</div>
          </button>
          <button
            className={[
              "rounded-xl border px-3.5 py-2 text-xs font-medium transition-colors",
              isReadonly
                ? "cursor-default border-border/30 bg-muted/20 opacity-50 text-muted-foreground"
                : "cursor-pointer border-border/50 bg-card/30 text-muted-foreground hover:border-primary/30 hover:bg-primary/5 hover:text-primary",
            ].join(" ")}
            disabled={isReadonly}
            onClick={handleChooseDifferent}
            type="button"
          >
            Choose a different location or doctor
          </button>
        </div>
      </div>
    </div>
  );
}
