import { tool } from "ai";
import { z } from "zod";

export const selectAppointmentType = tool({
  description:
    "Show appointment type options after the user selects a date, before showing available slots. Call this after the user picks a date from the upcoming appointments view.",
  inputSchema: z.object({
    patientId: z
      .string()
      .describe("The patient's unique identifier, carried from getPatientAppointments"),
    date: z.string().describe("Selected date in yyyy-MM-dd format"),
    displayDate: z.string().describe("Human-readable date, e.g. Monday, April 14"),
    appointmentTypes: z
      .array(z.string())
      .describe("List of appointment types, from getPatientAppointments output"),
  }),
  execute: async (input) => input,
});
