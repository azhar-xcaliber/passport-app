"use client";

import { CalendarIcon, MapPinIcon, StethoscopeIcon } from "lucide-react";
import { useActiveChat } from "@/hooks/use-active-chat";

type DoctorOption = {
  id: string;
  name: string;
  specialty: string;
  nextAvailable: string;
};

type DoctorSelectorData = {
  patientId: string;
  locationId: string;
  locationName: string;
  doctors: DoctorOption[];
};

export function DoctorSelector({ data }: { data: DoctorSelectorData }) {
  const { sendMessage, isReadonly } = useActiveChat();

  const handleSelect = (doctor: DoctorOption) => {
    if (isReadonly) return;
    sendMessage({
      role: "user",
      parts: [{ type: "text", text: `I'd like to see ${doctor.name}` }],
    });
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-(--shadow-float)">
      {/* Header */}
      <div className="border-b border-border/30 bg-muted/50 px-4 py-3">
        <div className="flex items-center gap-1.5 text-muted-foreground/70 text-[11px] font-medium uppercase tracking-wider">
          <StethoscopeIcon size={10} />
          Select a doctor
        </div>
        <div className="mt-1 flex items-center gap-1 text-muted-foreground text-xs">
          <MapPinIcon size={10} />
          <span className="font-medium text-foreground">{data.locationName}</span>
        </div>
      </div>

      {/* Doctor list */}
      <div className="divide-y divide-border/30">
        {data.doctors.map((doctor) => (
          <button
            className={[
              "w-full px-4 py-3 text-left transition-colors",
              isReadonly
                ? "cursor-default opacity-50"
                : "cursor-pointer hover:bg-muted/30",
            ].join(" ")}
            disabled={isReadonly}
            key={doctor.id}
            onClick={() => handleSelect(doctor)}
            type="button"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/60 ring-1 ring-border/30">
                <StethoscopeIcon className="text-muted-foreground" size={13} />
              </div>
              <div className="flex-1">
                <div className="font-medium text-foreground text-xs">{doctor.name}</div>
                <div className="mt-0.5 text-muted-foreground/60 text-[11px]">
                  {doctor.specialty}
                </div>
                <div className="mt-1 flex items-center gap-1 text-muted-foreground/50 text-[11px]">
                  <CalendarIcon size={9} />
                  Next available: {doctor.nextAvailable}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
