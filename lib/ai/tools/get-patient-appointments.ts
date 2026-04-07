import { tool } from "ai";
import {
  addDays,
  format,
  isWeekend,
  setHours,
  setMinutes,
  startOfDay,
} from "date-fns";
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

function generateMockData(patientId: string) {
  const today = startOfDay(new Date());

  // Deterministic upcoming appointments (1–2 existing)
  const upcomingAppointments = [
    {
      id: `appt-${patientId}-1`,
      date: format(addDays(today, 5), "yyyy-MM-dd"),
      time: "10:00",
      displayTime: "10:00 AM",
      provider: PROVIDERS[0].name,
      type: "Follow-up",
      status: "confirmed" as const,
      location: "Main Campus, Suite 204",
    },
  ];

  // Available slots for next 14 days, skipping weekends deterministically
  const availableSlots: Array<{
    date: string;
    slots: Array<{
      id: string;
      time: string;
      displayTime: string;
      provider: string;
      providerId: string;
      type: string;
    }>;
  }> = [];

  let dayOffset = 1;
  let slotsAdded = 0;

  while (slotsAdded < 10) {
    const date = addDays(today, dayOffset);
    dayOffset++;

    if (isWeekend(date)) continue;

    const dateStr = format(date, "yyyy-MM-dd");
    const daySlots = SLOT_TIMES.filter((_, i) => {
      return seededRandom(`${patientId}-${dateStr}`, i) > 0.45;
    }).map((slot, i) => {
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

    if (daySlots.length > 0) {
      availableSlots.push({ date: dateStr, slots: daySlots });
      slotsAdded++;
    }
  }

  return { upcomingAppointments, availableSlots };
}

async function fetchFromFhir(patientId: string, sourceId: string) {
  const apiBase = process.env.FHIR_API_BASE;
  const token = process.env.FHIR_BEARER_TOKEN;

  if (!apiBase || !token) return null;

  try {
    const res = await fetch(
      `${apiBase}/Patient/${patientId}/Appointment?status=booked,fulfilled&_sort=date&_count=5`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-source-id": sourceId,
          "x-interaction-mode": "async",
          "x-data-tier": "primary",
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) return null;

    const bundle = await res.json();
    const entries = bundle.entry ?? [];

    const upcomingAppointments = entries
      .map(
        (entry: {
          resource: {
            id: string;
            start: string;
            status: string;
            appointmentType?: { coding?: Array<{ display?: string }> };
            participant?: Array<{
              actor?: { display?: string; reference?: string };
            }>;
          };
        }) => {
          const appt = entry.resource;
          const start = new Date(appt.start);
          const practitioner = appt.participant?.find((p) =>
            p.actor?.reference?.startsWith("Practitioner")
          );
          return {
            id: appt.id,
            date: format(start, "yyyy-MM-dd"),
            time: format(start, "HH:mm"),
            displayTime: format(start, "h:mm a"),
            provider: practitioner?.actor?.display ?? "Unknown Provider",
            type:
              appt.appointmentType?.coding?.[0]?.display ?? "General Checkup",
            status: (appt.status === "fulfilled"
              ? "confirmed"
              : "booked") as "confirmed" | "booked",
            location: "Main Campus",
          };
        }
      )
      .filter(
        (a: { date: string }) =>
          new Date(a.date) >= startOfDay(new Date())
      );

    return { upcomingAppointments };
  } catch {
    return null;
  }
}

export const getPatientAppointments = tool({
  description:
    "Fetch a patient's upcoming appointments and available scheduling slots. Use this when the user wants to view, manage, or schedule an appointment for a patient.",
  inputSchema: z.object({
    patientId: z.string().describe("The patient's unique identifier"),
    patientName: z
      .string()
      .optional()
      .describe("Patient's display name, if known"),
    sourceId: z
      .string()
      .optional()
      .describe("EHR source system ID (defaults to Athena)"),
    departmentId: z.string().optional().describe("Department ID"),
  }),
  execute: async (input) => {
    const sourceId =
      input.sourceId ??
      process.env.FHIR_SOURCE_ID_ATHENA ??
      "1b5bf039-1757-341e-b12b-0d6e2009c534";

    const fhirData = await fetchFromFhir(input.patientId, sourceId);
    const mockData = generateMockData(input.patientId);

    const upcomingAppointments =
      fhirData?.upcomingAppointments ?? mockData.upcomingAppointments;

    return {
      patientId: input.patientId,
      patientName: input.patientName ?? `Patient ${input.patientId}`,
      upcomingAppointments,
      availableSlots: mockData.availableSlots,
      appointmentTypes: APPOINTMENT_TYPES,
    };
  },
});
