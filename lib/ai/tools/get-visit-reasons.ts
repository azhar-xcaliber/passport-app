import { tool } from "ai";
import { z } from "zod";

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
  execute: ({ patientId, providerNpi, providerName, facilityId, facilityName }) => {
    const response = {
      prov_fac_details: {
        npi: 1_093_678_211,
        emr_apuid: 311_299,
        emr_uid: 142_857,
        fname: "BEEVA",
        lname: "CHUDAL",
        degree: "FNP",
        gender: "female",
        healow_uri: "beeva-chudal-3931100",
        accept_requests: 0,
        oa_specialties: "Nurse Practitioner",
        appt_facilities: [
          {
            apu_id: 311_299,
            fac_id: 210,
            name: "BE WELL PRIMARY CARE MEDICINE ALLIANCE",
            address1: "3800 NORTH TARRANT PARKWAY",
            address2: "Suite 210",
            city: "FORT WORTH",
            state: "TX",
            zip: "76244",
            country_code: "US",
            prov_visit_reasons: [
              { id: 268_462, reason: "Allergy Therapy Consult", visit_code_id: 104, visit_reason_mapping_type: 1, package_questionnaire_mapped: false },
              { id: 268_464, reason: "Follow-up", visit_code_id: 104, visit_reason_mapping_type: 1, package_questionnaire_mapped: false },
              { id: 268_465, reason: "Hormone Consultation", visit_code_id: 104, visit_reason_mapping_type: 1, package_questionnaire_mapped: false },
              { id: 268_466, reason: "Hospital Follow-Up", visit_code_id: 439, visit_reason_mapping_type: 1, package_questionnaire_mapped: false },
              { id: 268_467, reason: "IV Therapy Consultation", visit_code_id: 104, visit_reason_mapping_type: 1, package_questionnaire_mapped: false },
              { id: 272_284, reason: "Medicare visit", visit_code_id: 472, visit_reason_mapping_type: 1, package_questionnaire_mapped: false },
              { id: 268_468, reason: "New Patient", visit_code_id: 110, visit_reason_mapping_type: 1, package_questionnaire_mapped: false },
              { id: 268_469, reason: "Referral Request", visit_code_id: 104, visit_reason_mapping_type: 1, package_questionnaire_mapped: false },
              { id: 268_470, reason: "Sick Visit", visit_code_id: 505, visit_reason_mapping_type: 1, package_questionnaire_mapped: false },
              { id: 268_471, reason: "Weight Loss Consultation", visit_code_id: 460, visit_reason_mapping_type: 1, package_questionnaire_mapped: false },
            ],
          },
        ],
      },
    };

    const facDetails = response.prov_fac_details as {
      appt_facilities: Array<{
        fac_id: number;
        prov_visit_reasons: Array<{
          id: number;
          reason: string;
        }>;
      }>;
    };

    const facility =
      facDetails.appt_facilities.find((f) => String(f.fac_id) === facilityId) ??
      facDetails.appt_facilities[0];

    const visitReasons = (facility?.prov_visit_reasons ?? []).map((r) => ({
      id: r.id,
      reason: r.reason,
    }));

    return { patientId, providerNpi, providerName, facilityId, facilityName, visitReasons };
  },
});
