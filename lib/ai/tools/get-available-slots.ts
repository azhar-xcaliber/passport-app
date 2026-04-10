import { tool } from "ai";
import { format, parseISO } from "date-fns";
import { z } from "zod";
import { healowPost } from "@/lib/ai/healow/client";

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
}

export const getAvailableSlots = tool({
  description:
    "Get available appointment time slots for a specific provider, facility, and visit reason over the next 7 days. Call this after the patient selects a visit reason.",
  inputSchema: z.object({
    patientId: z.string().describe("The verified patient's unique identifier"),
    providerNpi: z.string().describe("The selected provider's NPI number"),
    providerName: z.string().describe("The selected provider's full name"),
    facilityId: z.string().describe("The selected clinic facility ID (fac_id)"),
    facilityName: z.string().describe("The selected clinic facility name"),
    visitReasonId: z.number().describe("The selected visit reason ID"),
    visitReasonName: z.string().describe("The selected visit reason display name"),
    startDate: z
      .string()
      .describe("Start date in yyyy-MM-dd format, defaults to today"),
  }),
  execute: async ({
    patientId,
    providerNpi,
    providerName,
    facilityId,
    facilityName,
    visitReasonId,
    visitReasonName,
    startDate,
  }) => {
    try {
      const apuId = process.env.HEALOW_APU_ID ?? "311299";
      const response = await healowPost("GetProviderSlotsAtFacility", {
        oa_source: "3",
        provider_npi: providerNpi,
        apu_id: apuId,
        facility_id: facilityId,
        start_date: startDate,
        time_pref: "anytime",
        is_pt_existing: "1",
        practice_visit_reason_id: String(visitReasonId),
        days: "7",
        user_timezone_name: "America/Los_Angeles",
        package_questionnaire_answer: "",
      });

      const data = response as {
        start_date: string;
        end_date: string;
        prov_slots: {
          provider_npi: number;
          apu_id: number;
          facility_id: number;
          appt_slots: Array<{
            appt_date: string;
            appt_slots: Array<{
              prov_id: number;
              fac_id: number;
              date: string;
              time: string;
              duration: string;
              search_txid: number;
            }>;
          }>;
        };
      };

      const days = data.prov_slots.appt_slots
        .filter((day) => day.appt_slots.length > 0)
        .map((day) => ({
          date: day.appt_date,
          displayDate: format(parseISO(day.appt_date), "EEEE, MMMM d"),
          slots: day.appt_slots.map((slot) => ({
            id: `${slot.date}-${slot.time}-${slot.search_txid}`,
            time: slot.time,
            displayTime: formatTime(slot.time),
            duration: slot.duration,
            searchTxid: slot.search_txid,
            provId: slot.prov_id,
            facId: slot.fac_id,
            apuId: data.prov_slots.apu_id,
          })),
        }));

      return {
        patientId,
        providerNpi,
        providerName,
        facilityId,
        facilityName,
        visitReasonId,
        visitReasonName,
        startDate: data.start_date,
        endDate: data.end_date,
        days,
      };
    } catch (err) {
      return { error: (err as Error).message };
    }
  },
});
