import { tool } from "ai";
import { format, isWeekend, parseISO, startOfDay } from "date-fns";
import { z } from "zod";

const APPOINTMENT_TYPES = [
  "General Checkup",
  "Follow-up",
  "Lab Review",
  "Specialist Consultation",
  "Annual Physical",
];

const PROVIDERS = [
  { id: "prov-001", name: "Dr. Sarah Chen", specialty: "Primary Care" },
  { id: "prov-002", name: "Dr. Michael Torres", specialty: "Internal Medicine" },
  { id: "prov-003", name: "Dr. Aisha Patel", specialty: "Family Medicine" },
];

const SLOT_TIMES = [
  { time: "08:00", label: "8:00 AM" },
  { time: "08:30", label: "8:30 AM" },
  { time: "09:00", label: "9:00 AM" },
  { time: "09:30", label: "9:30 AM" },
  { time: "10:00", label: "10:00 AM" },
  { time: "10:30", label: "10:30 AM" },
  { time: "11:00", label: "11:00 AM" },
  { time: "13:00", label: "1:00 PM" },
  { time: "13:30", label: "1:30 PM" },
  { time: "14:00", label: "2:00 PM" },
  { time: "14:30", label: "2:30 PM" },
  { time: "15:00", label: "3:00 PM" },
  { time: "15:30", label: "3:30 PM" },
  { time: "16:00", label: "4:00 PM" },
];

function seededRandom(seed: string, index: number): number {
  let hash = 0;
  const str = `${seed}-${index}`;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) / 2_147_483_647;
}

export const getAvailableSlots = tool({
  description:
    "Get available appointment slots for a specific patient on a specific date. Call this after the user picks a date from the upcoming appointments view. Always pass the patientId from the previous getPatientAppointments call.",
  inputSchema: z.object({
    patientId: z
      .string()
      .describe(
        "The patient's unique identifier, carried from getPatientAppointments"
      ),
    date: z
      .string()
      .describe(
        "Date in yyyy-MM-dd format (e.g. 2026-04-14). Convert natural language dates to this format using today's date as reference."
      ),
  }),
  execute: async ({ patientId, date }) => {
    const parsed = parseISO(date);
    const today = startOfDay(new Date());

    // Return empty if the date is in the past or a weekend
    if (parsed < today || isWeekend(parsed)) {
      return {
        patientId,
        date,
        displayDate: format(parsed, "EEEE, MMMM d"),
        slots: [],
      };
    }

    const dateStr = format(parsed, "yyyy-MM-dd");
    const displayDate = format(parsed, "EEEE, MMMM d");

    // Same seeded generation logic as getPatientAppointments for consistency
    const slots = SLOT_TIMES.filter((_, i) =>
      seededRandom(`${patientId}-${dateStr}`, i) > 0.45
    ).map((slot, i) => {
      const providerIndex = Math.floor(
        seededRandom(`${patientId}-${dateStr}-prov`, i) * PROVIDERS.length
      );
      const typeIndex = Math.floor(
        seededRandom(`${patientId}-${dateStr}-type`, i) *
          APPOINTMENT_TYPES.length
      );
      const provider = PROVIDERS[providerIndex];
      return {
        id: `slot-${dateStr}-${slot.time}`,
        time: slot.time,
        displayTime: slot.label,
        provider: provider.name,
        providerId: provider.id,
        type: APPOINTMENT_TYPES[typeIndex],
      };
    });

    return { patientId, date: dateStr, displayDate, slots };
  },
});
