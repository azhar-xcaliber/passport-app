"use client";

import {
  BuildingIcon,
  CheckCircle2,
  ClockIcon,
  PillIcon,
  AlertTriangleIcon,
} from "lucide-react";

type RefillConfirmationData = {
  patientId: string;
  patientName: string;
  medicationName: string;
  dosage: string;
  dosesRemaining: number | null;
  prescriptionNumber: string | null;
  prescribingDoctor: string | null;
  pharmacy: string;
  urgency: "routine" | "soon" | "urgent";
  requestId: string;
  status: string;
  estimatedReady: string;
};

function Row({
  icon,
  label,
  value,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5">
      <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 ring-1 ring-emerald-500/20">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-muted-foreground/60 text-[10px] uppercase tracking-wider">
          {label}
        </div>
        {value ? (
          <div className="truncate font-medium text-foreground text-xs">
            {value}
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

const urgencyDisplay: Record<
  RefillConfirmationData["urgency"],
  { label: string; className: string }
> = {
  routine: {
    label: "Routine",
    className:
      "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-400",
  },
  soon: {
    label: "Running Low",
    className:
      "bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:text-amber-400",
  },
  urgent: {
    label: "Urgent",
    className:
      "bg-red-500/10 text-red-700 ring-red-500/20 dark:text-red-400",
  },
};

export function RefillConfirmation({
  data,
}: {
  data: RefillConfirmationData;
}) {
  const urgency = urgencyDisplay[data.urgency];

  return (
    <div className="overflow-hidden rounded-2xl border border-emerald-500/20 bg-emerald-500/5 shadow-(--shadow-float)">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-emerald-500/15 bg-emerald-500/10 px-4 py-3">
        <CheckCircle2
          className="text-emerald-600 dark:text-emerald-400"
          size={16}
        />
        <span className="font-semibold text-emerald-700 text-sm dark:text-emerald-300">
          Refill Request Submitted
        </span>
      </div>

      {/* Detail rows */}
      <div className="divide-y divide-emerald-500/10">
        <Row
          icon={
            <PillIcon
              className="text-emerald-600 dark:text-emerald-400"
              size={12}
            />
          }
          label="Medication"
          value={`${data.medicationName} · ${data.dosage}`}
        />
        <Row
          icon={
            <BuildingIcon
              className="text-emerald-600 dark:text-emerald-400"
              size={12}
            />
          }
          label="Pharmacy"
          value={data.pharmacy}
        />
        <Row
          icon={
            <AlertTriangleIcon
              className="text-emerald-600 dark:text-emerald-400"
              size={12}
            />
          }
          label="Urgency"
        >
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ${urgency.className}`}
          >
            {urgency.label}
          </span>
        </Row>
        <Row
          icon={
            <ClockIcon
              className="text-emerald-600 dark:text-emerald-400"
              size={12}
            />
          }
          label="Estimated Ready"
          value={data.estimatedReady}
        />
      </div>

      {/* Request ID */}
      <div className="border-t border-emerald-500/15 bg-emerald-500/5 px-4 py-3">
        <div className="text-muted-foreground/60 text-[10px] uppercase tracking-wider">
          Request ID
        </div>
        <div className="mt-0.5 font-mono font-semibold text-emerald-700 text-sm tracking-widest dark:text-emerald-300">
          {data.requestId}
        </div>
        <div className="mt-1 text-muted-foreground/50 text-[10px]">
          You will receive a notification when your refill is ready for
          pickup
        </div>
      </div>
    </div>
  );
}
