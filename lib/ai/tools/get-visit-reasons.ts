import { tool } from "ai";
import { z } from "zod";
import { healowPost } from "@/lib/ai/healow/client";

export const getVisitReasons = tool({
  description:
    "Get the list of visit reasons (appointment types) available for a specific provider at a clinic. Call this after the patient selects a doctor, before showing available time slots.",
  inputSchema: z.object({
    patientId: z.string().describe("The verified patient's unique identifier"),
    providerNpi: z.string().describe("The selected provider's NPI number"),
    providerName: z.string().describe("The selected provider's full name"),
    facilityId: z.string().describe("The selected clinic facility ID (fac_id)"),
    facilityName: z.string().describe("The selected clinic facility name"),
  }),
  execute: async ({ patientId, providerNpi, providerName, facilityId, facilityName }) => {
    try {
      const response = await healowPost("GetOAProviderFaceSheetDetails", {
        oa_source: "3",
        prov_npi: providerNpi,
        visit_reason: "",
        practice_visit_reason_id: "",
        visit_reason_search_by: "visit_reason_name",
      });

      const facDetails = response.prov_fac_details as {
        appt_facilities: Array<{
          fac_id: number;
          prov_visit_reasons: Array<{
            id: number;
            reason: string;
          }>;
        }>;
      };

      const facility = facDetails.appt_facilities.find(
        (f) => String(f.fac_id) === facilityId,
      ) ?? facDetails.appt_facilities[0];

      const visitReasons = (facility?.prov_visit_reasons ?? []).map((r) => ({
        id: r.id,
        reason: r.reason,
      }));

      return { patientId, providerNpi, providerName, facilityId, facilityName, visitReasons };
    } catch (err) {
      return { error: (err as Error).message };
    }
  },
});
