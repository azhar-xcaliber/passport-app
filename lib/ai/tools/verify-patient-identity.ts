import { tool } from "ai";
import { z } from "zod";
import { findPatient } from "@/lib/ai/mock-data/patients";

export const verifyPatientIdentity = tool({
  description:
    "Verify a patient's identity using their full name and date of birth. Call this at the start of both medication refill and appointment booking flows before any other patient-specific tool.",
  inputSchema: z.object({
    name: z.string().describe("Patient's full name"),
    dateOfBirth: z
      .string()
      .describe("Date of birth in YYYY-MM-DD format (e.g. 1985-03-15)"),
  }),
  execute: async ({ name, dateOfBirth }) => {
    const patient = findPatient(name, dateOfBirth);

    if (!patient) {
      return {
        verified: false as const,
        message:
          "We could not verify your identity. Please check your name and date of birth and try again.",
      };
    }

    return {
      verified: true as const,
      patientId: patient.patientId,
      patientName: patient.name,
      dateOfBirth,
      memberId: patient.memberId,
      lastPharmacy: patient.lastPharmacy,
    };
  },
});
