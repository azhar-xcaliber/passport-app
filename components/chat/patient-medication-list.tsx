"use client";

import { AlertTriangleIcon, CalendarIcon, PillIcon, UserIcon } from "lucide-react";
import { useActiveChat } from "@/hooks/use-active-chat";

type MedicationInfo = {
  name: string;
  dosage: string;
  refillsRemaining: number;
  refillsTotal: number;
  lastFilled: string;
  daysSupply: number;
  prescribingDoctor: string;
  hasRefills: boolean;
  runningLow: boolean;
};

type PatientMedicationListData = {
  patientId: string;
  patientName: string;
  medications: MedicationInfo[];
};

export function PatientMedicationList({ data }: { data: PatientMedicationListData }) {
  const { sendMessage, isReadonly } = useActiveChat();

  const handleRefill = (med: MedicationInfo) => {
    if (isReadonly) return;
    sendMessage({
      role: "user",
      parts: [{ type: "text", text: `I'd like to refill ${med.name} ${med.dosage}` }],
    });
  };

  const handleScheduleAppointment = (med: MedicationInfo) => {
    if (isReadonly) return;
    sendMessage({
      role: "user",
      parts: [
        {
          type: "text",
          text: `I need to schedule an appointment to get more refills for ${med.name}`,
        },
      ],
    });
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-(--shadow-float)">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border/30 bg-muted/50 px-4 py-3">
        <div className="flex size-7 items-center justify-center rounded-lg bg-background ring-1 ring-border/50">
          <PillIcon className="text-muted-foreground" size={14} />
        </div>
        <div>
          <div className="font-semibold text-foreground text-sm leading-none">
            Your Medications
          </div>
          <div className="mt-0.5 flex items-center gap-1 text-muted-foreground text-xs">
            <UserIcon size={10} />
            {data.patientName}
          </div>
        </div>
      </div>

      {/* Medication list */}
      <div className="divide-y divide-border/30">
        {data.medications.map((med) => (
          <div className="px-4 py-3" key={`${med.name}-${med.dosage}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/60 ring-1 ring-border/30">
                  <PillIcon className="text-muted-foreground" size={13} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground text-xs">
                      {med.name}
                    </span>
                    <span className="text-muted-foreground/60 text-[11px]">
                      {med.dosage}
                    </span>
                    {med.runningLow && (
                      <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-700 ring-1 ring-amber-500/20 dark:text-amber-400">
                        <AlertTriangleIcon size={9} />
                        Low
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 flex items-center gap-3 text-muted-foreground/60 text-[11px]">
                    <span className="flex items-center gap-1">
                      <UserIcon size={9} />
                      {med.prescribingDoctor}
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarIcon size={9} />
                      Last filled {med.lastFilled}
                    </span>
                  </div>
                </div>
              </div>

              {/* Refill count badge */}
              <div className="shrink-0 text-right">
                <div
                  className={[
                    "font-mono text-xs font-semibold",
                    med.hasRefills
                      ? med.runningLow
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-emerald-600 dark:text-emerald-400"
                      : "text-muted-foreground/50",
                  ].join(" ")}
                >
                  {med.refillsRemaining}/{med.refillsTotal}
                </div>
                <div className="text-muted-foreground/40 text-[10px]">refills</div>
              </div>
            </div>

            {/* Action button */}
            <div className="mt-2.5 flex justify-end">
              {med.hasRefills ? (
                <button
                  className={[
                    "rounded-xl border px-3.5 py-1.5 text-xs font-medium transition-colors",
                    isReadonly
                      ? "cursor-default border-border/30 bg-muted/20 opacity-50 text-muted-foreground"
                      : "cursor-pointer border-primary/30 bg-primary/5 text-primary hover:bg-primary/10",
                  ].join(" ")}
                  disabled={isReadonly}
                  onClick={() => handleRefill(med)}
                  type="button"
                >
                  Refill this medication
                </button>
              ) : (
                <button
                  className={[
                    "rounded-xl border px-3.5 py-1.5 text-xs font-medium transition-colors",
                    isReadonly
                      ? "cursor-default border-border/30 bg-muted/20 opacity-50 text-muted-foreground"
                      : "cursor-pointer border-border/50 bg-muted/30 text-muted-foreground hover:border-primary/30 hover:bg-primary/5 hover:text-primary",
                  ].join(" ")}
                  disabled={isReadonly}
                  onClick={() => handleScheduleAppointment(med)}
                  type="button"
                >
                  No refills — Schedule appointment
                </button>
              )}
            </div>
          </div>
        ))}

        {data.medications.length === 0 && (
          <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
            <PillIcon className="text-muted-foreground/20" size={28} />
            <p className="text-muted-foreground/60 text-xs">No medications on file</p>
          </div>
        )}
      </div>
    </div>
  );
}
