"use client";

import {
  CalendarIcon,
  CreditCardIcon,
  MapPinIcon,
  PencilIcon,
  StethoscopeIcon,
  UserIcon,
} from "lucide-react";
import { useActiveChat } from "@/hooks/use-active-chat";

type AppointmentSummaryData = {
  patientId: string;
  patientName: string;
  locationId: string;
  locationName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  reasonForVisit: string;
  hasInsurance: boolean;
  insuranceProvider: string | null;
  insurancePlanId: string | null;
};

function SummaryRow({
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
      <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted/60 ring-1 ring-border/30">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-muted-foreground/60 text-[10px] uppercase tracking-wider">
          {label}
        </div>
        <div className="truncate font-medium text-foreground text-xs">{value}</div>
      </div>
    </div>
  );
}

export function AppointmentSummary({ data }: { data: AppointmentSummaryData }) {
  const { sendMessage, isReadonly } = useActiveChat();

  const handleConfirm = () => {
    if (isReadonly) return;
    sendMessage({
      role: "user",
      parts: [{ type: "text", text: "I confirm this appointment" }],
    });
  };

  const handleChange = (field: "location" | "doctor" | "reason") => {
    if (isReadonly) return;
    const messages = {
      location: "I'd like to change the location",
      doctor: "I'd like to change the doctor",
      reason: "I'd like to change the reason for visit",
    };
    sendMessage({
      role: "user",
      parts: [{ type: "text", text: messages[field] }],
    });
  };

  const insuranceValue = data.hasInsurance
    ? `${data.insuranceProvider}${data.insurancePlanId ? ` · ${data.insurancePlanId}` : ""}`
    : "None provided";

  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-(--shadow-float)">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border/30 bg-muted/50 px-4 py-3">
        <div className="flex size-7 items-center justify-center rounded-lg bg-background ring-1 ring-border/50">
          <CalendarIcon className="text-muted-foreground" size={14} />
        </div>
        <div>
          <div className="font-semibold text-foreground text-sm leading-none">
            Appointment Summary
          </div>
          <div className="mt-0.5 flex items-center gap-1 text-muted-foreground text-xs">
            <UserIcon size={10} />
            {data.patientName}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="divide-y divide-border/30">
        <div className="flex items-center justify-between pr-3">
          <SummaryRow
            icon={<MapPinIcon className="text-muted-foreground/60" size={12} />}
            label="Location"
            value={data.locationName}
          />
          <button
            aria-label="Change location"
            className={[
              "flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] transition-colors",
              isReadonly
                ? "cursor-default opacity-40 text-muted-foreground"
                : "cursor-pointer text-muted-foreground/60 hover:text-primary hover:bg-primary/5",
            ].join(" ")}
            disabled={isReadonly}
            onClick={() => handleChange("location")}
            type="button"
          >
            <PencilIcon size={10} />
            Change
          </button>
        </div>

        <div className="flex items-center justify-between pr-3">
          <SummaryRow
            icon={<StethoscopeIcon className="text-muted-foreground/60" size={12} />}
            label="Doctor"
            value={`${data.doctorName} · ${data.doctorSpecialty}`}
          />
          <button
            aria-label="Change doctor"
            className={[
              "flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] transition-colors",
              isReadonly
                ? "cursor-default opacity-40 text-muted-foreground"
                : "cursor-pointer text-muted-foreground/60 hover:text-primary hover:bg-primary/5",
            ].join(" ")}
            disabled={isReadonly}
            onClick={() => handleChange("doctor")}
            type="button"
          >
            <PencilIcon size={10} />
            Change
          </button>
        </div>

        <div className="flex items-center justify-between pr-3">
          <SummaryRow
            icon={<UserIcon className="text-muted-foreground/60" size={12} />}
            label="Reason for Visit"
            value={data.reasonForVisit}
          />
          <button
            aria-label="Change reason"
            className={[
              "flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] transition-colors",
              isReadonly
                ? "cursor-default opacity-40 text-muted-foreground"
                : "cursor-pointer text-muted-foreground/60 hover:text-primary hover:bg-primary/5",
            ].join(" ")}
            disabled={isReadonly}
            onClick={() => handleChange("reason")}
            type="button"
          >
            <PencilIcon size={10} />
            Change
          </button>
        </div>

        <SummaryRow
          icon={<CreditCardIcon className="text-muted-foreground/60" size={12} />}
          label="Insurance"
          value={insuranceValue}
        />
      </div>

      {/* Confirm */}
      <div className="border-t border-border/30 px-4 py-3">
        <button
          className={[
            "w-full rounded-xl border py-2.5 text-xs font-semibold transition-colors",
            isReadonly
              ? "cursor-default border-border/30 bg-muted/20 opacity-50 text-muted-foreground"
              : "cursor-pointer border-primary bg-primary text-primary-foreground hover:bg-primary/90",
          ].join(" ")}
          disabled={isReadonly}
          onClick={handleConfirm}
          type="button"
        >
          Confirm Appointment
        </button>
      </div>
    </div>
  );
}
