import { tool } from "ai";
import { z } from "zod";
import { addDays, format } from "date-fns";
import { ALL_DOCTORS, DOCTORS_BY_LOCATION } from "@/lib/ai/mock-data/patients";

function seededRandom(seed: string, index: number): number {
  let hash = 0;
  const str = `${seed}-${index}`;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) / 2_147_483_647;
}

export const getDoctorsAtLocation = tool({
  description:
    "Get the list of doctors available at a specific clinic location. Call this after the patient selects a clinic location during appointment booking.",
  inputSchema: z.object({
    patientId: z.string().describe("The verified patient's unique identifier"),
    locationId: z.string().describe("The selected clinic location ID (e.g. loc-001)"),
    locationName: z.string().describe("The selected clinic location name"),
  }),
  execute: async ({ patientId, locationId, locationName }) => {
    const doctorIds = DOCTORS_BY_LOCATION[locationId] ?? Object.keys(ALL_DOCTORS).slice(0, 3);
    const doctors = ALL_DOCTORS.filter((d) => doctorIds.includes(d.id));

    // Generate a deterministic "next available" date for each doctor
    const today = new Date();
    const doctorsWithAvailability = doctors.map((doctor, i) => {
      const daysAhead = Math.floor(seededRandom(`${patientId}-${locationId}-${doctor.id}`, i) * 7) + 1;
      const nextAvailable = format(addDays(today, daysAhead), "EEEE, MMMM d");
      return {
        id: doctor.id,
        name: doctor.name,
        specialty: doctor.specialty,
        nextAvailable,
      };
    });

    return {
      patientId,
      locationId,
      locationName,
      doctors: doctorsWithAvailability,
    };
  },
});
