import { tool } from "ai";
import { z } from "zod";
import { findPatientById } from "@/lib/ai/mock-data/patients";

export const getPatientInsurance = tool({
  description:
    "Retrieve a patient's insurance information on file. Call this during the appointment booking flow after the reason for visit has been collected. If no insurance is on file, the UI will prompt the patient to provide details.",
  inputSchema: z.object({
    patientId: z
      .string()
      .describe("The verified patient's unique identifier"),
    patientName: z.string().optional().describe("Patient's display name"),
  }),
  execute: async ({ patientId, patientName }) => {
    const patient = findPatientById(patientId);

    if (!patient) {
      return {
        patientId,
        patientName: patientName ?? patientId,
        hasInsurance: false as const,
        insurance: null,
      };
    }

    if (!patient.insurance) {
      return {
        patientId: patient.patientId,
        patientName: patient.name,
        hasInsurance: false as const,
        insurance: null,
      };
    }

    return {
      patientId: patient.patientId,
      patientName: patient.name,
      hasInsurance: true as const,
      insurance: patient.insurance,
    };
  },
});
