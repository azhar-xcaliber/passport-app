import { tool } from "ai";
import { z } from "zod";

export const showAppointmentSummary = tool({
  description:
    "Display a summary of the proposed appointment for the patient to review and confirm before booking. Call this after all details have been gathered (location, doctor, reason for visit, insurance). The patient can confirm or request changes to any field.",
  inputSchema: z.object({
    patientId: z.string().describe("The verified patient's unique identifier"),
    patientName: z.string().describe("Patient's display name"),
    locationId: z.string().describe("Selected clinic location ID"),
    locationName: z.string().describe("Selected clinic location name"),
    doctorId: z.string().describe("Selected doctor's unique identifier"),
    doctorName: z.string().describe("Selected doctor's full name"),
    doctorSpecialty: z.string().describe("Selected doctor's specialty"),
    reasonForVisit: z
      .string()
      .describe("Patient's stated reason for the visit"),
    displayDate: z
      .string()
      .optional()
      .describe("Human-readable appointment date, e.g. 'Monday, April 14'"),
    displayTime: z
      .string()
      .optional()
      .describe("Human-readable appointment time, e.g. '10:00 AM'"),
    hasInsurance: z
      .boolean()
      .describe("Whether insurance information is on file"),
    insuranceProvider: z
      .string()
      .nullable()
      .describe("Insurance provider name, or null if none"),
    insurancePlanId: z
      .string()
      .nullable()
      .describe("Insurance plan ID, or null if none"),
  }),
  // Pure pass-through — all logic is in the UI component and system prompt
  execute: async (input) => input,
});
