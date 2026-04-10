import { tool } from "ai";
import { z } from "zod";
import { findPatientById, NEARBY_PHARMACIES } from "@/lib/ai/mock-data/patients";

export const getNearbyPharmacies = tool({
  description:
    "Fetch a list of nearby pharmacies for the patient to choose from. Call this when the patient does not want to use their usual pharmacy for a medication refill.",
  inputSchema: z.object({
    patientId: z
      .string()
      .describe("The verified patient's unique identifier"),
    patientName: z.string().optional().describe("Patient's display name"),
  }),
  execute: async ({ patientId, patientName }) => {
    const patient = findPatientById(patientId);

    return {
      patientId,
      patientName: patient?.name ?? patientName ?? patientId,
      pharmacies: NEARBY_PHARMACIES,
    };
  },
});
