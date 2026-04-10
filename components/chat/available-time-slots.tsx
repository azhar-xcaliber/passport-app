"use client";

import { CalendarIcon, ClockIcon, StethoscopeIcon } from "lucide-react";
import { useActiveChat } from "@/hooks/use-active-chat";

type Slot = {
  id: string;
  time: string;
  displayTime: string;
  duration: string;
  searchTxid: number;
  provId: number;
  facId: number;
  apuId: number;
};

type DaySlots = {
  date: string;
  displayDate: string;
  slots: Slot[];
};

type AvailableTimeSlotsData = {
  patientId: string;
  providerName: string;
  visitReasonName: string;
  days: DaySlots[];
};

export function AvailableTimeSlots({
  data,
}: {
  data: AvailableTimeSlotsData;
}) {
  const { sendMessage, isReadonly } = useActiveChat();

  const handleSlotSelect = (day: DaySlots, slot: Slot) => {
    if (isReadonly) {
      return;
    }
    sendMessage({
      role: "user",
      parts: [
        {
          type: "text",
          text: `I'll take ${day.displayDate} at ${slot.displayTime}`,
        },
      ],
    });
  };

  const hasSlots = data.days.length > 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-(--shadow-float)">
      {/* Header */}
      <div className="border-b border-border/30 bg-muted/50 px-4 py-3">
        <div className="flex items-center gap-1.5 text-muted-foreground/70 text-[11px] font-medium uppercase tracking-wider">
          <CalendarIcon size={10} />
          Available times
        </div>
        <div className="mt-1 flex items-center gap-1 text-muted-foreground text-xs">
          <StethoscopeIcon size={10} />
          <span className="font-medium text-foreground">{data.providerName}</span>
          <span className="text-muted-foreground/50">·</span>
          <span>{data.visitReasonName}</span>
        </div>
      </div>

      {/* Days */}
      <div className="divide-y divide-border/30">
        {hasSlots ? (
          data.days.map((day) => (
            <div className="px-4 py-3" key={day.date}>
              {/* Date label */}
              <div className="mb-2.5 flex items-center gap-1.5">
                <CalendarIcon className="text-muted-foreground/50" size={10} />
                <span className="text-muted-foreground text-[11px] font-medium">
                  {day.displayDate}
                </span>
              </div>
              {/* Time chips */}
              <div className="flex flex-wrap gap-2">
                {day.slots.map((slot) => (
                  <button
                    className={[
                      "flex items-center gap-1.5 rounded-xl border px-3 py-2 transition-colors",
                      isReadonly
                        ? "cursor-default border-border/30 bg-muted/20 opacity-50"
                        : "cursor-pointer border-border/50 bg-card/30 hover:border-primary/40 hover:bg-primary/5",
                    ].join(" ")}
                    disabled={isReadonly}
                    key={slot.id}
                    onClick={() => handleSlotSelect(day, slot)}
                    type="button"
                  >
                    <ClockIcon className="text-muted-foreground/50" size={10} />
                    <span className="font-semibold text-foreground text-xs">
                      {slot.displayTime}
                    </span>
                    <span className="text-muted-foreground/40 text-[10px]">
                      {slot.duration}m
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center gap-2 p-6 text-center">
            <CalendarIcon className="text-muted-foreground/30" size={20} />
            <p className="text-muted-foreground/60 text-xs">
              No availability in the next 7 days — reply in chat to check a different week
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
