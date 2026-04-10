import { tool } from "ai";
import { z } from "zod";
import { CLINIC_LOCATIONS } from "@/lib/ai/mock-data/patients";

export const getClinicLocations = tool({
  description:
    "Retrieve the list of available clinic locations for booking an appointment. Call this when the patient needs to select a location (new patient, or returning patient who wants a different location).",
  inputSchema: z.object({
    patientId: z
      .string()
      .describe("The verified patient's unique identifier"),
  }),
  execute: async ({ patientId }) => {
    return {
      patientId,
      locations: CLINIC_LOCATIONS,
    };
  },
});
