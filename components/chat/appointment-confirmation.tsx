"use client";

import { CheckCircle2, ClockIcon, StethoscopeIcon, UserIcon } from "lucide-react";

type AppointmentConfirmationData = {
  patientId: string;
  patientName: string;
  date: string;
  displayDate: string;
  time: string;
  displayTime: string;
  provider: string;
  providerId: string;
  type: string;
  confirmationId: string;
};

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
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
        <div className="truncate font-medium text-foreground text-xs">
          {value}
        </div>
      </div>
    </div>
  );
}

export function AppointmentConfirmation({
  data,
}: {
  data: AppointmentConfirmationData;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-emerald-500/20 bg-emerald-500/5 shadow-(--shadow-float)">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-emerald-500/15 bg-emerald-500/10 px-4 py-3">
        <CheckCircle2 className="text-emerald-600 dark:text-emerald-400" size={16} />
        <span className="font-semibold text-emerald-700 text-sm dark:text-emerald-300">
          Appointment Confirmed
        </span>
      </div>

      {/* Detail rows */}
      <div className="divide-y divide-emerald-500/10">
        <Row
          icon={<UserIcon className="text-emerald-600 dark:text-emerald-400" size={12} />}
          label="Patient"
          value={data.patientName}
        />
        <Row
          icon={<ClockIcon className="text-emerald-600 dark:text-emerald-400" size={12} />}
          label="Date & Time"
          value={`${data.displayDate} · ${data.displayTime}`}
        />
        <Row
          icon={<StethoscopeIcon className="text-emerald-600 dark:text-emerald-400" size={12} />}
          label="Provider"
          value={data.provider}
        />
        <Row
          icon={<StethoscopeIcon className="text-emerald-600 dark:text-emerald-400" size={12} />}
          label="Type"
          value={data.type}
        />
      </div>

      {/* Confirmation ID */}
      <div className="border-t border-emerald-500/15 bg-emerald-500/5 px-4 py-3">
        <div className="text-muted-foreground/60 text-[10px] uppercase tracking-wider">
          Confirmation
        </div>
        <div className="mt-0.5 font-mono font-semibold text-emerald-700 text-sm tracking-widest dark:text-emerald-300">
          {data.confirmationId}
        </div>
        <div className="mt-1 text-muted-foreground/50 text-[10px]">
          A reminder will be sent 24 hours before your appointment
        </div>
      </div>
    </div>
  );
}
