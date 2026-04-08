import { tool } from "ai";
import { format, parseISO } from "date-fns";
import { z } from "zod";
import { generateUUID } from "@/lib/utils";

export const bookAppointment = tool({
  description:
    "Book a patient appointment with the selected slot details. Call this after the user confirms their chosen time slot. Returns a confirmation card — no side effects.",
  inputSchema: z.object({
    patientId: z
      .string()
      .describe("The patient's unique identifier, carried from getPatientAppointments"),
    patientName: z.string().describe("Patient's display name"),
    date: z.string().describe("Appointment date in yyyy-MM-dd format"),
    displayDate: z
      .string()
      .optional()
      .describe("Human-readable date, e.g. Monday, April 14"),
    time: z.string().describe("Appointment time in 24h format, e.g. 09:00"),
    displayTime: z.string().describe("Human-readable time, e.g. 9:00 AM"),
    provider: z.string().describe("Full provider name, e.g. Dr. Sarah Chen"),
    providerId: z.string().describe("Provider's unique identifier"),
    type: z.string().describe("Appointment type, e.g. General Checkup"),
  }),
  execute: async (input) => {
    const displayDate =
      input.displayDate ?? format(parseISO(input.date), "EEEE, MMMM d, yyyy");
    const confirmationId = generateUUID().slice(0, 8).toUpperCase();

    return {
      patientId: input.patientId,
      patientName: input.patientName,
      date: input.date,
      displayDate,
      time: input.time,
      displayTime: input.displayTime,
      provider: input.provider,
      providerId: input.providerId,
      type: input.type,
      confirmationId,
    };
  },
});
