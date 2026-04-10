import { tool } from "ai";
import { z } from "zod";
import { findPatient } from "@/lib/ai/mock-data/patients";

export const verifyPatientIdentity = tool({
  description:
    "Verify a patient's identity using their full name, date of birth, and member ID. Call this at the start of both medication refill and appointment booking flows before any other patient-specific tool.",
  inputSchema: z.object({
    name: z.string().describe("Patient's full name as it appears on their insurance card"),
    dateOfBirth: z
      .string()
      .describe("Date of birth in YYYY-MM-DD format (e.g. 1985-03-15)"),
    memberId: z
      .string()
      .describe("Member ID (e.g. MEM-1001). May include or omit the 'MEM-' prefix."),
  }),
  execute: async ({ name, dateOfBirth, memberId }) => {
    // Normalize memberId — accept with or without "MEM-" prefix
    const normalizedId = memberId.toUpperCase().startsWith("MEM-")
      ? memberId.toUpperCase()
      : `MEM-${memberId.toUpperCase()}`;

    const patient = findPatient(name, dateOfBirth, normalizedId);

    if (!patient) {
      return {
        verified: false as const,
        message:
          "We could not verify your identity. Please check your name, date of birth, and member ID and try again.",
      };
    }

    return {
      verified: true as const,
      patientId: patient.patientId,
      patientName: patient.name,
      memberId: patient.memberId,
      lastPharmacy: patient.lastPharmacy,
    };
  },
});
