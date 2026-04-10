"use client";

import { GlobeIcon, MapPinIcon, StethoscopeIcon, UserIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useActiveChat } from "@/hooks/use-active-chat";

type DoctorOption = {
  id: string;
  name: string;
  degree?: string;
  gender?: string;
  specialty: string;
  npi?: string;
  photoUrl?: string;
  acceptingNewPatients?: boolean;
  languages?: string;
  bio?: string;
};

type DoctorSelectorData = {
  patientId: string;
  locationId: string;
  locationName: string;
  doctors: DoctorOption[];
};

function DoctorAvatar({ photoUrl, name }: { photoUrl?: string; name: string }) {
  const [imgError, setImgError] = useState(false);
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return (
    <div className="mt-0.5 size-10 shrink-0 rounded-full ring-1 ring-border/30 overflow-hidden bg-muted/60">
      {photoUrl && !imgError ? (
        <Image
          alt={name}
          className="size-full object-cover"
          height={40}
          onError={() => setImgError(true)}
          src={photoUrl}
          width={40}
        />
      ) : (
        <span className="flex size-full items-center justify-center text-primary font-semibold text-sm bg-primary/10">
          {initials}
        </span>
      )}
    </div>
  );
}

export function DoctorSelector({ data }: { data: DoctorSelectorData }) {
  const { sendMessage, isReadonly } = useActiveChat();

  const handleSelect = (doctor: DoctorOption) => {
    if (isReadonly) {
      return;
    }
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
          <span className="font-medium text-foreground">
            {data.locationName}
          </span>
        </div>
      </div>

      {/* Doctor list */}
      <div className="divide-y divide-border/30">
        {data.doctors.map((doctor) => (
          <button
            className={[
              "w-full px-4 py-4 text-left transition-colors",
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
              <DoctorAvatar name={doctor.name} photoUrl={doctor.photoUrl} />

              <div className="flex-1 min-w-0">
                {/* Name + gender */}
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground text-sm">
                    {doctor.name}
                  </span>
                  {doctor.gender && (
                    <span className="flex items-center gap-0.5 text-muted-foreground/50 text-[11px] capitalize">
                      <UserIcon size={9} />
                      {doctor.gender}
                    </span>
                  )}
                </div>

                {/* Degree + specialty */}
                <div className="mt-0.5 flex items-center gap-1 text-muted-foreground/70 text-[11px]">
                  <StethoscopeIcon size={9} />
                  {[doctor.degree, doctor.specialty].filter(Boolean).join(", ")}
                </div>

                {/* Languages */}
                {doctor.languages && (
                  <div className="mt-0.5 flex items-center gap-1 text-muted-foreground/50 text-[11px]">
                    <GlobeIcon size={9} />
                    {doctor.languages}
                  </div>
                )}

                {/* Accepting patients badge */}
                {doctor.acceptingNewPatients != null && (
                  <div className="mt-2">
                    <span
                      className={[
                        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset",
                        doctor.acceptingNewPatients
                          ? "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground ring-border/50",
                      ].join(" ")}
                    >
                      {doctor.acceptingNewPatients
                        ? "Accepting New Patients"
                        : "Not Accepting New Patients"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
