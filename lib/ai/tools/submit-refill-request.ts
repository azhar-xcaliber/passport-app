import { tool } from "ai";
import { z } from "zod";
import { generateUUID } from "@/lib/utils";

export const submitRefillRequest = tool({
  description:
    "Submit a medication refill request after all required information has been gathered. Call this when the medication name, dosage, pharmacy, and urgency are all known. Returns a confirmation card with a request ID.",
  inputSchema: z.object({
    patientId: z.string().describe("The patient's unique identifier"),
    patientName: z.string().describe("Patient's display name"),
    medicationName: z.string().describe("Full medication name"),
    dosage: z.string().describe("Dosage/strength (e.g. '10mg')"),
    dosesRemaining: z
      .number()
      .nullable()
      .describe("Doses remaining, if known"),
    prescriptionNumber: z
      .string()
      .nullable()
      .describe("Rx number, if available"),
    prescribingDoctor: z
      .string()
      .nullable()
      .describe("Prescribing doctor, if known"),
    pharmacy: z.string().describe("Pharmacy name for the refill"),
    urgency: z
      .enum(["routine", "soon", "urgent"])
      .describe(
        "Urgency level: 'routine' (plenty remaining), 'soon' (running low within a week), 'urgent' (out or nearly out)"
      ),
  }),
  execute: async (input) => {
    const requestId = generateUUID().slice(0, 8).toUpperCase();

    return {
      ...input,
      requestId,
      status: "submitted" as const,
      estimatedReady:
        input.urgency === "urgent"
          ? "Today"
          : input.urgency === "soon"
            ? "1-2 business days"
            : "3-5 business days",
    };
  },
});
