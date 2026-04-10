import { tool } from "ai";
import { z } from "zod";
import { findPatientById } from "@/lib/ai/mock-data/patients";

export const getPatientHistory = tool({
  description:
    "Retrieve a patient's visit history and returning-patient status. Call this after identity verification at the start of the appointment booking flow to determine whether to fast-track (same doctor/location) or go through full selection.",
  inputSchema: z.object({
    patientId: z
      .string()
      .describe("The verified patient's unique identifier from verifyPatientIdentity"),
    patientName: z.string().optional().describe("Patient's display name"),
  }),
  execute: async ({ patientId, patientName }) => {
    const patient = findPatientById(patientId);

    if (!patient) {
      return {
        patientId,
        patientName: patientName ?? patientId,
        isReturning: false,
        lastDoctor: null,
        lastDoctorId: null,
        lastLocation: null,
        lastLocationId: null,
        visitHistory: [],
      };
    }

    return {
      patientId: patient.patientId,
      patientName: patient.name,
      isReturning: patient.isReturning,
      lastDoctor: patient.lastDoctor,
      lastDoctorId: patient.lastDoctorId,
      lastLocation: patient.lastLocation,
      lastLocationId: patient.lastLocationId,
      visitHistory: patient.visitHistory,
    };
  },
});
