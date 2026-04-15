import { tool } from "ai";
import { z } from "zod";
import { healowPost } from "@/lib/ai/healow/client";

export const getClinicLocations = tool({
  description:
    "Retrieve the list of available clinic locations for booking an appointment. Call this when the patient needs to select a location (new patient, or returning patient who wants a different location).",
  inputSchema: z.object({
    patientId: z
      .string()
      .describe("The verified patient's unique identifier"),
  }),
  execute: async ({ patientId }) => {
    try {
      const apuId = process.env.HEALOW_APU_ID ?? "311299";
      const response = await healowPost(
        "GetOAFacilitiesForPracticeBySpecialityOrProvider",
        {
          oa_source: "3",
          apu_id: apuId,
          visit_reason: "",
          speciality_id: "149",
          lat: "",
          lng: "",
          questionnaire_guid: "",
        },
      );

      const facList = response.fac_list as Array<{
        fac_id: number;
        name: string;
        address1: string;
        address2: string;
        city: string;
        state: string;
        zip: string;
        lat: number;
        lng: number;
        facility_time_zone: string;
      }>;

      const locations = facList.map((fac) => ({
        id: String(fac.fac_id),
        name: fac.name.replace(/BE WELL\s*/i, "").trim(),
        address: [fac.address1, fac.address2, fac.city, fac.state, fac.zip]
          .filter(Boolean)
          .join(", "),
        lat: fac.lat,
        lng: fac.lng,
        timezone: fac.facility_time_zone,
      }));

      return { patientId, locations };
    } catch (err) {
      return { error: (err as Error).message };
    }
  },
});
