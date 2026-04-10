import { tool } from "ai";
import { z } from "zod";
import { findPatientById } from "@/lib/ai/mock-data/patients";

export const getPatientMedications = tool({
  description:
    "Retrieve a verified patient's current medication list with refill eligibility. Call this after identity verification to show available medications and determine refill options.",
  inputSchema: z.object({
    patientId: z
      .string()
      .describe("The verified patient's unique identifier from verifyPatientIdentity"),
    patientName: z.string().optional().describe("Patient's display name"),
  }),
  execute: ({ patientId, patientName }) => {
    const patient = findPatientById(patientId);

    if (!patient) {
      return {
        patientId,
        patientName: patientName ?? patientId,
        medications: [],
      };
    }

    const medications = patient.medications.map((med) => ({
      name: med.name,
      dosage: med.dosage,
      refillsRemaining: med.refillsRemaining,
      refillsTotal: med.refillsTotal,
      lastFilled: med.lastFilled,
      daysSupply: med.daysSupply,
      prescribingDoctor: med.prescribingDoctor,
      hasRefills: med.refillsRemaining > 0,
      // "Running low" = 2 or fewer refills left
      runningLow: med.refillsRemaining > 0 && med.refillsRemaining <= 2,
    }));

    return {
      patientId: patient.patientId,
      patientName: patient.name,
      medications,
    };
  },
});
