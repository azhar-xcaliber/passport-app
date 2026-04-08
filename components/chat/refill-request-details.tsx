"use client";

import {
  AlertCircleIcon,
  BuildingIcon,
  HashIcon,
  PillIcon,
  UserIcon,
} from "lucide-react";
import { useActiveChat } from "@/hooks/use-active-chat";

type RefillRequestDetailsData = {
  patientId: string;
  patientName?: string;
  medicationName: string | null;
  dosage: string | null;
  dosesRemaining: number | null;
  prescriptionNumber: string | null;
  prescribingDoctor: string | null;
  pharmacy: string | null;
  missingFields: string[];
};

const urgencyOptions = [
  { label: "Routine — plenty left", value: "routine" },
  { label: "Running low soon", value: "soon" },
  { label: "Urgent — almost out", value: "urgent" },
] as const;

const missingFieldLabels: Record<string, string> = {
  medicationName: "Medication name",
  dosage: "Dosage / strength",
  dosesRemaining: "Doses remaining",
  pharmacy: "Pharmacy",
};

export function RefillRequestDetails({
  data,
}: {
  data: RefillRequestDetailsData;
}) {
  const { sendMessage, isReadonly } = useActiveChat();

  const handleUrgencySelect = (option: (typeof urgencyOptions)[number]) => {
    if (isReadonly) {
      return;
    }
    sendMessage({
      role: "user",
      parts: [
        {
          type: "text",
          text: `My urgency level is: ${option.label}`,
        },
      ],
    });
  };

  const handleMissingFieldClick = (field: string) => {
    if (isReadonly) {
      return;
    }
    const label = missingFieldLabels[field] ?? field;
    sendMessage({
      role: "user",
      parts: [
        {
          type: "text",
          text: `I'd like to provide my ${label.toLowerCase()}`,
        },
      ],
    });
  };

  const hasExtractedDetails =
    data.medicationName ||
    data.dosage ||
    data.prescriptionNumber ||
    data.prescribingDoctor ||
    data.pharmacy ||
    data.dosesRemaining != null;

  const nonUrgencyMissing = data.missingFields.filter((f) => f !== "urgency");
  const needsUrgency = data.missingFields.includes("urgency");

  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-(--shadow-float)">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border/30 bg-muted/50 px-4 py-3">
        <div className="flex size-7 items-center justify-center rounded-lg bg-background ring-1 ring-border/50">
          <PillIcon className="text-muted-foreground" size={14} />
        </div>
        <div>
          <div className="font-semibold text-foreground text-sm leading-none">
            Medication Refill Request
          </div>
          {data.patientName && (
            <div className="mt-0.5 flex items-center gap-1 text-muted-foreground text-xs">
              <UserIcon size={10} />
              {data.patientName}
            </div>
          )}
        </div>
      </div>

      {/* Extracted details */}
      {hasExtractedDetails && (
        <div className="divide-y divide-border/30">
          {data.medicationName && (
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/60 ring-1 ring-border/30">
                <PillIcon className="text-muted-foreground" size={13} />
              </div>
              <div>
                <div className="font-medium text-foreground text-xs">
                  {data.medicationName}
                  {data.dosage && ` · ${data.dosage}`}
                </div>
                <div className="text-muted-foreground/70 text-[11px]">
                  Medication{data.dosage ? " & dosage" : ""}
                </div>
              </div>
            </div>
          )}
          {!data.medicationName && data.dosage && (
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/60 ring-1 ring-border/30">
                <HashIcon className="text-muted-foreground" size={13} />
              </div>
              <div>
                <div className="font-medium text-foreground text-xs">
                  {data.dosage}
                </div>
                <div className="text-muted-foreground/70 text-[11px]">
                  Dosage
                </div>
              </div>
            </div>
          )}
          {data.dosesRemaining != null && (
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/60 ring-1 ring-border/30">
                <AlertCircleIcon className="text-muted-foreground" size={13} />
              </div>
              <div>
                <div className="font-medium text-foreground text-xs">
                  {data.dosesRemaining} remaining
                </div>
                <div className="text-muted-foreground/70 text-[11px]">
                  Doses left
                </div>
              </div>
            </div>
          )}
          {data.prescriptionNumber && (
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/60 ring-1 ring-border/30">
                <HashIcon className="text-muted-foreground" size={13} />
              </div>
              <div>
                <div className="font-medium text-foreground text-xs">
                  {data.prescriptionNumber}
                </div>
                <div className="text-muted-foreground/70 text-[11px]">
                  Rx number
                </div>
              </div>
            </div>
          )}
          {data.prescribingDoctor && (
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/60 ring-1 ring-border/30">
                <UserIcon className="text-muted-foreground" size={13} />
              </div>
              <div>
                <div className="font-medium text-foreground text-xs">
                  {data.prescribingDoctor}
                </div>
                <div className="text-muted-foreground/70 text-[11px]">
                  Prescribing doctor
                </div>
              </div>
            </div>
          )}
          {data.pharmacy && (
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/60 ring-1 ring-border/30">
                <BuildingIcon className="text-muted-foreground" size={13} />
              </div>
              <div>
                <div className="font-medium text-foreground text-xs">
                  {data.pharmacy}
                </div>
                <div className="text-muted-foreground/70 text-[11px]">
                  Pharmacy
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Missing fields */}
      {nonUrgencyMissing.length > 0 && (
        <div className="border-t border-border/30 px-4 py-3">
          <div className="mb-2 flex items-center gap-1.5 text-muted-foreground/70 text-[11px] font-medium uppercase tracking-wider">
            <AlertCircleIcon size={10} />
            Still needed
          </div>
          <div className="flex flex-wrap gap-2">
            {nonUrgencyMissing.map((field) => (
              <button
                className={[
                  "rounded-xl border px-3.5 py-2 text-xs font-medium transition-colors",
                  isReadonly
                    ? "cursor-default border-border/30 bg-muted/20 opacity-50 text-muted-foreground"
                    : "cursor-pointer border-border/50 bg-card/30 text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary",
                ].join(" ")}
                disabled={isReadonly}
                key={field}
                onClick={() => handleMissingFieldClick(field)}
                type="button"
              >
                {missingFieldLabels[field] ?? field}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Urgency selection */}
      {needsUrgency && (
        <div className="border-t border-border/30 px-4 py-3">
          <div className="mb-2 flex items-center gap-1.5 text-muted-foreground/70 text-[11px] font-medium uppercase tracking-wider">
            <PillIcon size={10} />
            How urgent is this refill?
          </div>
          <div className="flex flex-wrap gap-2">
            {urgencyOptions.map((option) => (
              <button
                className={[
                  "rounded-xl border px-3.5 py-2 text-xs font-medium transition-colors",
                  isReadonly
                    ? "cursor-default border-border/30 bg-muted/20 opacity-50 text-muted-foreground"
                    : "cursor-pointer border-border/50 bg-card/30 text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary",
                ].join(" ")}
                disabled={isReadonly}
                key={option.value}
                onClick={() => handleUrgencySelect(option)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
