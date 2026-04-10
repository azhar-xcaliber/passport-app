"use client";

import { BuildingIcon, ClockIcon, PackageIcon, TruckIcon } from "lucide-react";
import { useActiveChat } from "@/hooks/use-active-chat";

type PharmacyOption = {
  id: string;
  name: string;
  address: string;
  distance: string;
  hours: string;
  hasDelivery: boolean;
};

type PharmacySelectorData = {
  patientId: string;
  patientName: string;
  pharmacies: PharmacyOption[];
};

export function PharmacySelector({ data }: { data: PharmacySelectorData }) {
  const { sendMessage, isReadonly } = useActiveChat();

  const handleSelect = (pharmacy: PharmacyOption) => {
    if (isReadonly) return;
    sendMessage({
      role: "user",
      parts: [
        {
          type: "text",
          text: `I'd like to use ${pharmacy.name} at ${pharmacy.address}`,
        },
      ],
    });
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-(--shadow-float)">
      {/* Header */}
      <div className="border-b border-border/30 bg-muted/50 px-4 py-3">
        <div className="flex items-center gap-1.5 text-muted-foreground/70 text-[11px] font-medium uppercase tracking-wider">
          <BuildingIcon size={10} />
          Select a pharmacy
        </div>
        <div className="mt-0.5 text-muted-foreground text-xs">
          {data.patientName}
        </div>
      </div>

      {/* Pharmacy list */}
      <div className="divide-y divide-border/30">
        {data.pharmacies.map((pharmacy) => (
          <button
            className={[
              "w-full px-4 py-3 text-left transition-colors",
              isReadonly
                ? "cursor-default opacity-50"
                : "cursor-pointer hover:bg-muted/30",
            ].join(" ")}
            disabled={isReadonly}
            key={pharmacy.id}
            onClick={() => handleSelect(pharmacy)}
            type="button"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/60 ring-1 ring-border/30">
                  <PackageIcon className="text-muted-foreground" size={13} />
                </div>
                <div>
                  <div className="font-medium text-foreground text-xs">
                    {pharmacy.name}
                  </div>
                  <div className="mt-0.5 text-muted-foreground/60 text-[11px]">
                    {pharmacy.address}
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-muted-foreground/50 text-[11px]">
                    <span className="flex items-center gap-1">
                      <ClockIcon size={9} />
                      {pharmacy.hours}
                    </span>
                    {pharmacy.hasDelivery && (
                      <span className="flex items-center gap-1 text-sky-600 dark:text-sky-400">
                        <TruckIcon size={9} />
                        Delivery
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {pharmacy.distance !== "N/A" && (
                <span className="shrink-0 text-muted-foreground/50 text-[11px]">
                  {pharmacy.distance}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
