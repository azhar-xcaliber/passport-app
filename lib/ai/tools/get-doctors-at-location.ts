import { tool } from "ai";
import { z } from "zod";
import { healowPost } from "@/lib/ai/healow/client";

export const getDoctorsAtLocation = tool({
  description:
    "Get the list of doctors available at a specific clinic location. Call this after the patient selects a clinic location during appointment booking.",
  inputSchema: z.object({
    patientId: z.string().describe("The verified patient's unique identifier"),
    locationId: z.string().describe("The selected clinic location ID (fac_id)"),
    locationName: z.string().describe("The selected clinic location name"),
    lat: z.number().describe("Latitude of the selected clinic location"),
    lng: z.number().describe("Longitude of the selected clinic location"),
  }),
  execute: async ({ patientId, locationId, locationName, lat, lng }) => {
    try {
      const apuId = process.env.HEALOW_APU_ID ?? "311299";
      const response = await healowPost("GetAvilableApptProvidersList", {
        page: "1",
        oa_source: "3",
        apu_id: apuId,
        visit_reason: "",
        speciality_name: "Primary Care Provider",
        speciality_id: "149",
        search_type: "1",
        facility_id: locationId,
        prov_gender: "any",
        language_ids: "",
        lat: String(lat),
        lng: String(lng),
        questionnaire_guid: "",
        accept_new_pt: "0",
      });

      const provList = response.prov_list as Array<{
        provider_enc_npi: string;
        provider_fname: string;
        provider_lname: string;
        provider_degree: string;
        provider_gender: string;
        provider_speciality: string;
        provider_npi: string;
        provider_pic_url: string;
        accept_new_patients: number;
        languages: string;
        professional_statement: string;
      }>;

      const doctors = provList.map((prov) => ({
        id: prov.provider_enc_npi,
        name: `${prov.provider_fname} ${prov.provider_lname}`,
        degree: prov.provider_degree,
        gender: prov.provider_gender,
        specialty: prov.provider_speciality,
        npi: prov.provider_npi,
        photoUrl: `https://healow.com${prov.provider_pic_url}`,
        acceptingNewPatients: prov.accept_new_patients === 1,
        languages: prov.languages,
        bio: prov.professional_statement,
      }));

      return { patientId, locationId, locationName, doctors };
    } catch (err) {
      return { error: (err as Error).message };
    }
  },
});
