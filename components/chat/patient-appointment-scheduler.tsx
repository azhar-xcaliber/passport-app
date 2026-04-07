"use client";

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClockIcon,
  MapPinIcon,
  PlusIcon,
  StethoscopeIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";

type Appointment = {
  id: string;
  date: string;
  time: string;
  displayTime: string;
  provider: string;
  type: string;
  status: "booked" | "confirmed" | "pending";
  location: string;
};

type Slot = {
  id: string;
  time: string;
  displayTime: string;
  provider: string;
  providerId: string;
  type: string;
};

type DaySlots = {
  date: string;
  slots: Slot[];
};

type PatientAppointmentData = {
  patientId: string;
  patientName: string;
  upcomingAppointments: Appointment[];
  availableSlots: DaySlots[];
  appointmentTypes: string[];
};

const STATUS_COLORS: Record<string, string> = {
  confirmed:
    "bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-400",
  booked: "bg-sky-500/10 text-sky-600 ring-1 ring-sky-500/20 dark:text-sky-400",
  pending:
    "bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20 dark:text-amber-400",
};

function groupSlotsByPeriod(slots: Slot[]) {
  const morning = slots.filter((s) => {
    const hour = Number.parseInt(s.time.split(":")[0], 10);
    return hour < 12;
  });
  const afternoon = slots.filter((s) => {
    const hour = Number.parseInt(s.time.split(":")[0], 10);
    return hour >= 12 && hour < 17;
  });
  const evening = slots.filter((s) => {
    const hour = Number.parseInt(s.time.split(":")[0], 10);
    return hour >= 17;
  });
  return { morning, afternoon, evening };
}

function MiniCalendar({
  currentMonth,
  selectedDate,
  availableDates,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}: {
  currentMonth: Date;
  selectedDate: Date | null;
  availableDates: Set<string>;
  onSelectDate: (d: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}) {
  const today = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const isAvailable = (d: Date) => availableDates.has(format(d, "yyyy-MM-dd"));
  const isPast = (d: Date) =>
    isBefore(d, startOfMonth(today)) || (isBefore(d, today) && !isToday(d));
  const isOtherMonth = (d: Date) =>
    isBefore(d, monthStart) || isAfter(d, monthEnd);

  return (
    <div className="select-none">
      <div className="mb-3 flex items-center justify-between">
        <button
          className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          onClick={onPrevMonth}
          type="button"
        >
          <ChevronLeft size={15} />
        </button>
        <span className="font-semibold text-foreground text-sm">
          {format(currentMonth, "MMMM yyyy")}
        </span>
        <button
          className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          onClick={onNextMonth}
          type="button"
        >
          <ChevronRight size={15} />
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-0.5">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div
            className="text-center font-medium text-muted-foreground/60 text-xs"
            key={d}
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const available = isAvailable(day);
          const past = isPast(day);
          const other = isOtherMonth(day);
          const selected = selectedDate && isSameDay(day, selectedDate);
          const todayDay = isToday(day);

          return (
            <button
              className={[
                "relative flex h-8 w-full flex-col items-center justify-center rounded-lg text-xs transition-all",
                other && !available ? "opacity-25" : "",
                past && !selected ? "cursor-not-allowed opacity-40" : "",
                selected
                  ? "bg-primary font-semibold text-primary-foreground shadow-(--shadow-card)"
                  : available && !past
                    ? "cursor-pointer font-medium text-foreground hover:bg-muted hover:text-foreground"
                    : "cursor-default text-muted-foreground/50",
                todayDay && !selected ? "ring-1 ring-border" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              disabled={past || (!available && !selected)}
              key={key}
              onClick={() => available && !past && onSelectDate(day)}
              type="button"
            >
              {format(day, "d")}
              {available && !past && !selected && (
                <span className="absolute bottom-0.5 size-1 rounded-full bg-primary/40" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SlotButton({
  slot,
  selected,
  onSelect,
}: {
  slot: Slot;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      className={[
        "rounded-lg border px-3 py-2 text-left text-xs transition-all",
        selected
          ? "border-primary bg-primary text-primary-foreground shadow-(--shadow-card)"
          : "border-border/50 bg-card/30 text-muted-foreground hover:border-border hover:bg-card/60 hover:text-foreground hover:shadow-(--shadow-card)",
      ].join(" ")}
      onClick={onSelect}
      type="button"
    >
      <div className="font-semibold">{slot.displayTime}</div>
      <div
        className={[
          "text-[10px]",
          selected ? "text-primary-foreground/60" : "text-muted-foreground/60",
        ].join(" ")}
      >
        {slot.provider.split(" ").at(-1)}
      </div>
    </button>
  );
}

export function PatientAppointmentScheduler({
  data,
}: {
  data: PatientAppointmentData;
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [filterType, setFilterType] = useState<string>("All");
  const [step, setStep] = useState<"overview" | "pick" | "confirm" | "success">(
    "overview"
  );

  const availableDates = new Set(data.availableSlots.map((d) => d.date));

  const slotsForSelectedDate = selectedDate
    ? (data.availableSlots.find(
        (d) => d.date === format(selectedDate, "yyyy-MM-dd")
      )?.slots ?? [])
    : [];

  const filteredSlots =
    filterType === "All"
      ? slotsForSelectedDate
      : slotsForSelectedDate.filter((s) => s.type === filterType);

  const { morning, afternoon, evening } = groupSlotsByPeriod(filteredSlots);

  const handleDateSelect = (d: Date) => {
    setSelectedDate(d);
    setSelectedSlot(null);
  };

  const uniqueTypes = [
    "All",
    ...new Set(slotsForSelectedDate.map((s) => s.type)),
  ];

  return (
    <div className="flex h-[400px] flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-(--shadow-float)">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/30 bg-muted/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-background ring-1 ring-border/50">
            <StethoscopeIcon className="text-muted-foreground" size={14} />
          </div>
          <div>
            <div className="font-semibold text-foreground text-sm leading-none">
              Schedule Appointment
            </div>
            <div className="mt-0.5 flex items-center gap-1 text-muted-foreground text-xs">
              <UserIcon size={10} />
              {data.patientName}
            </div>
          </div>
        </div>
        {(step === "pick" || step === "confirm") && (
          <button
            className="flex size-6 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            onClick={() => {
              setStep("overview");
              setSelectedSlot(null);
            }}
            type="button"
          >
            <XIcon size={12} />
          </button>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          {/* ── Overview ── */}
          {step === "overview" && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="flex min-h-0 flex-1 flex-col"
              exit={{ opacity: 0, y: -8 }}
              initial={{ opacity: 0, y: 8 }}
              key="overview"
              transition={{ duration: 0.18 }}
            >
              <div className="flex-1 overflow-y-auto">
                {data.upcomingAppointments.length > 0 ? (
                  <div className="flex flex-col gap-0 divide-y divide-border/30">
                    {data.upcomingAppointments.map((appt) => (
                      <div
                        className="flex items-start justify-between px-4 py-3"
                        key={appt.id}
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className="font-semibold text-foreground text-xs">
                            {format(parseISO(appt.date), "EEE, MMM d")} ·{" "}
                            {appt.displayTime}
                          </span>
                          <span className="text-muted-foreground text-[11px]">
                            {appt.provider}
                          </span>
                          <span className="text-muted-foreground/60 text-[10px]">
                            {appt.type} · {appt.location}
                          </span>
                        </div>
                        <span
                          className={[
                            "rounded-full px-2 py-0.5 font-medium text-[10px] capitalize",
                            STATUS_COLORS[appt.status] ?? STATUS_COLORS.pending,
                          ].join(" ")}
                        >
                          {appt.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                    <CalendarIcon
                      className="text-muted-foreground/20"
                      size={28}
                    />
                    <p className="text-muted-foreground/60 text-xs">
                      No upcoming appointments
                    </p>
                  </div>
                )}
              </div>

              {/* Footer CTA */}
              <div className="shrink-0 border-t border-border/30 bg-muted/30 px-4 py-3">
                <button
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground text-xs shadow-(--shadow-card) transition-colors hover:bg-primary/80"
                  onClick={() => setStep("pick")}
                  type="button"
                >
                  <PlusIcon size={12} />
                  Schedule Appointment
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Pick date & slot ── */}
          {step === "pick" && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="flex min-h-0 flex-1 flex-col"
              exit={{ opacity: 0, y: -8 }}
              initial={{ opacity: 0, y: 8 }}
              key="pick"
              transition={{ duration: 0.18 }}
            >
              <div className="flex min-h-0 flex-1 divide-x divide-border/30">
                {/* Calendar panel */}
                <div className="w-52 shrink-0 overflow-y-auto p-4">
                  <MiniCalendar
                    availableDates={availableDates}
                    currentMonth={currentMonth}
                    onNextMonth={() => setCurrentMonth((m) => addMonths(m, 1))}
                    onPrevMonth={() => setCurrentMonth((m) => addMonths(m, -1))}
                    onSelectDate={handleDateSelect}
                    selectedDate={selectedDate}
                  />
                  <div className="mt-3 flex items-center gap-1.5 text-muted-foreground/60 text-[10px]">
                    <span className="inline-block size-1.5 rounded-full bg-primary/40" />
                    Available days
                  </div>
                </div>

                {/* Slots panel */}
                <div className="flex-1 overflow-y-auto p-4">
                  {selectedDate ? (
                    filteredSlots.length === 0 ? (
                      <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                        <ClockIcon
                          className="text-muted-foreground/20"
                          size={28}
                        />
                        <p className="text-muted-foreground/60 text-xs">
                          No slots for this type on{" "}
                          {format(selectedDate, "MMM d")}
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                          <div className="font-semibold text-foreground text-xs">
                            {format(selectedDate, "EEEE, MMMM d")}
                          </div>
                          {uniqueTypes.length > 2 && (
                            <div className="flex flex-wrap gap-1">
                              {uniqueTypes.map((t) => (
                                <button
                                  className={[
                                    "rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors",
                                    filterType === t
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
                                  ].join(" ")}
                                  key={t}
                                  onClick={() => setFilterType(t)}
                                  type="button"
                                >
                                  {t}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {morning.length > 0 && (
                          <div>
                            <div className="mb-1.5 font-medium text-muted-foreground/60 text-[10px] uppercase tracking-wider">
                              Morning
                            </div>
                            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                              {morning.map((slot) => (
                                <SlotButton
                                  key={slot.id}
                                  onSelect={() => setSelectedSlot(slot)}
                                  selected={selectedSlot?.id === slot.id}
                                  slot={slot}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {afternoon.length > 0 && (
                          <div>
                            <div className="mb-1.5 font-medium text-muted-foreground/60 text-[10px] uppercase tracking-wider">
                              Afternoon
                            </div>
                            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                              {afternoon.map((slot) => (
                                <SlotButton
                                  key={slot.id}
                                  onSelect={() => setSelectedSlot(slot)}
                                  selected={selectedSlot?.id === slot.id}
                                  slot={slot}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {evening.length > 0 && (
                          <div>
                            <div className="mb-1.5 font-medium text-muted-foreground/60 text-[10px] uppercase tracking-wider">
                              Evening
                            </div>
                            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                              {evening.map((slot) => (
                                <SlotButton
                                  key={slot.id}
                                  onSelect={() => setSelectedSlot(slot)}
                                  selected={selectedSlot?.id === slot.id}
                                  slot={slot}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                      <CalendarIcon
                        className="text-muted-foreground/20"
                        size={28}
                      />
                      <p className="text-muted-foreground/60 text-xs">
                        Select a date to see available times
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* CTA footer */}
              {selectedSlot && selectedDate && (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="flex shrink-0 items-center justify-between border-t border-border/30 bg-muted/30 px-4 py-3"
                  initial={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {format(selectedDate, "MMM d")}
                    </span>{" "}
                    at{" "}
                    <span className="font-semibold text-foreground">
                      {selectedSlot.displayTime}
                    </span>{" "}
                    ·{" "}
                    <span className="text-muted-foreground/60">
                      {selectedSlot.provider.split(" ").at(-1)}
                    </span>
                  </div>
                  <button
                    className="rounded-lg bg-primary px-3.5 py-1.5 font-semibold text-primary-foreground text-xs shadow-(--shadow-card) transition-colors hover:bg-primary/80 active:scale-95"
                    onClick={() => setStep("confirm")}
                    type="button"
                  >
                    Next →
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ── Confirm ── */}
          {step === "confirm" && selectedSlot && selectedDate && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="flex min-h-0 flex-1 flex-col overflow-y-auto"
              exit={{ opacity: 0, y: -8 }}
              initial={{ opacity: 0, y: 8 }}
              key="confirm"
              transition={{ duration: 0.18 }}
            >
              <div className="p-5">
                <p className="mb-4 font-semibold text-foreground text-sm">
                  Confirm your appointment
                </p>

                <div className="mb-4 overflow-hidden rounded-xl border border-border/30 bg-muted/30">
                  <div className="flex flex-col gap-0 divide-y divide-border/30">
                    <ConfirmRow
                      icon={
                        <CalendarIcon
                          className="text-muted-foreground"
                          size={13}
                        />
                      }
                      label="Date & Time"
                      value={`${format(selectedDate, "EEEE, MMMM d, yyyy")} · ${selectedSlot.displayTime}`}
                    />
                    <ConfirmRow
                      icon={
                        <UserIcon className="text-muted-foreground" size={13} />
                      }
                      label="Provider"
                      value={selectedSlot.provider}
                    />
                    <ConfirmRow
                      icon={
                        <StethoscopeIcon
                          className="text-muted-foreground"
                          size={13}
                        />
                      }
                      label="Type"
                      value={selectedSlot.type}
                    />
                    <ConfirmRow
                      icon={
                        <MapPinIcon
                          className="text-muted-foreground"
                          size={13}
                        />
                      }
                      label="Patient"
                      value={data.patientName}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    className="flex-1 rounded-lg border border-border/50 bg-input/30 px-3 py-2 font-medium text-muted-foreground text-xs transition-colors hover:bg-input/50 hover:text-foreground"
                    onClick={() => setStep("pick")}
                    type="button"
                  >
                    Change
                  </button>
                  <button
                    className="flex-1 rounded-lg bg-primary px-3 py-2 font-semibold text-primary-foreground text-xs shadow-(--shadow-card) transition-colors hover:bg-primary/80"
                    onClick={() => setStep("success")}
                    type="button"
                  >
                    Confirm Appointment
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Success ── */}
          {step === "success" && selectedSlot && selectedDate && (
            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              className="flex min-h-0 flex-1 items-center justify-center"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0, scale: 0.97 }}
              key="success"
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <div className="flex flex-col items-center gap-4 px-6 py-8 text-center">
                <motion.div
                  animate={{ scale: 1, opacity: 1 }}
                  initial={{ scale: 0.5, opacity: 0 }}
                  transition={{ delay: 0.05, type: "spring", stiffness: 200 }}
                >
                  <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/20">
                    <CheckCircle2
                      className="text-emerald-600 dark:text-emerald-400"
                      size={32}
                    />
                  </div>
                </motion.div>
                <div>
                  <p className="font-bold text-foreground text-base">
                    Appointment Scheduled
                  </p>
                  <p className="mt-1 text-muted-foreground text-xs">
                    {format(selectedDate, "MMMM d, yyyy")} at{" "}
                    {selectedSlot.displayTime} with {selectedSlot.provider}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-muted-foreground text-xs font-medium ring-1 ring-border/50">
                  <UserIcon size={11} />
                  {data.patientName} · {selectedSlot.type}
                </div>
                <button
                  className="mt-1 text-muted-foreground/60 text-xs underline underline-offset-2 hover:text-muted-foreground"
                  onClick={() => {
                    setStep("overview");
                    setSelectedDate(null);
                    setSelectedSlot(null);
                  }}
                  type="button"
                >
                  Schedule another
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ConfirmRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5">
      <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted/60 ring-1 ring-border/30">
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
