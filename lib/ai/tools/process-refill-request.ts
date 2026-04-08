import { tool } from "ai";
import { z } from "zod";

export const processRefillRequest = tool({
  description:
    "Process a medication refill request after the user uploads an image of their medication (bottle, prescription label, pill box). Analyze the image using vision, extract medication details, and call this tool with the extracted information. Set unreadable fields to null and list them in missingFields.",
  inputSchema: z.object({
    patientId: z
      .string()
      .describe(
        "The patient's unique identifier. If unknown, derive from the patient name (lowercase, hyphen-separated)"
      ),
    patientName: z
      .string()
      .optional()
      .describe("Patient's display name, if known"),
    medicationName: z
      .string()
      .nullable()
      .describe(
        "Medication name extracted from the image, or null if not readable"
      ),
    dosage: z
      .string()
      .nullable()
      .describe(
        "Dosage/strength extracted (e.g. '10mg', '500mg tablet'), or null if not readable"
      ),
    dosesRemaining: z
      .number()
      .nullable()
      .describe("Number of doses/pills remaining if visible, or null"),
    prescriptionNumber: z
      .string()
      .nullable()
      .describe("Rx number from the label, or null if not readable"),
    prescribingDoctor: z
      .string()
      .nullable()
      .describe("Prescribing doctor name from the label, or null"),
    pharmacy: z
      .string()
      .nullable()
      .describe("Pharmacy name from the label, or null"),
    missingFields: z
      .array(z.string())
      .describe(
        "List of field names that could not be extracted and need user input. Possible values: 'medicationName', 'dosage', 'dosesRemaining', 'pharmacy', 'urgency'"
      ),
  }),
  execute: async (input) => input,
});
