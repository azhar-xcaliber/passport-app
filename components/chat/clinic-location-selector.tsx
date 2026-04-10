"use client";

import { MapPinIcon, PhoneIcon } from "lucide-react";
import { useActiveChat } from "@/hooks/use-active-chat";

type ClinicLocation = {
  id: string;
  name: string;
  address: string;
  phone: string;
};

type ClinicLocationSelectorData = {
  patientId: string;
  locations: ClinicLocation[];
};

export function ClinicLocationSelector({ data }: { data: ClinicLocationSelectorData }) {
  const { sendMessage, isReadonly } = useActiveChat();

  const handleSelect = (location: ClinicLocation) => {
    if (isReadonly) return;
    sendMessage({
      role: "user",
      parts: [{ type: "text", text: `I'd like to go to ${location.name}` }],
    });
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-(--shadow-float)">
      {/* Header */}
      <div className="border-b border-border/30 bg-muted/50 px-4 py-3">
        <div className="flex items-center gap-1.5 text-muted-foreground/70 text-[11px] font-medium uppercase tracking-wider">
          <MapPinIcon size={10} />
          Select a location
        </div>
      </div>

      {/* Location list */}
      <div className="divide-y divide-border/30">
        {data.locations.map((location) => (
          <button
            className={[
              "w-full px-4 py-3 text-left transition-colors",
              isReadonly
                ? "cursor-default opacity-50"
                : "cursor-pointer hover:bg-muted/30",
            ].join(" ")}
            disabled={isReadonly}
            key={location.id}
            onClick={() => handleSelect(location)}
            type="button"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/60 ring-1 ring-border/30">
                <MapPinIcon className="text-muted-foreground" size={13} />
              </div>
              <div>
                <div className="font-medium text-foreground text-xs">
                  {location.name}
                </div>
                <div className="mt-0.5 flex items-center gap-1 text-muted-foreground/60 text-[11px]">
                  <MapPinIcon size={9} />
                  {location.address}
                </div>
                <div className="mt-0.5 flex items-center gap-1 text-muted-foreground/50 text-[11px]">
                  <PhoneIcon size={9} />
                  {location.phone}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
