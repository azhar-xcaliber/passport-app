import { tool } from "ai";
import { format, parseISO } from "date-fns";
import { z } from "zod";

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
}

const STATIC_SLOT = { npi: 0, apu_id: 311_299, enc_id: 0, prov_id: 142_857, fac_id: 210, date: "", time: "", duration: "30", visit_type: "MEDICARE", tz_code: "", cancellation: 0, open_model: 1, open_vt_rule: "1", search_txid: 575_579_646, linked_slots: [] as never[] };

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
  execute: ({
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
      const response = {
        end_date: "2026-05-28",
        prov_slots: {
          provider_npi: 1_093_678_211,
          apu_id: 311_299,
          facility_id: 210,
          appt_slots: [
            {
              appt_date: "2026-05-22",
              appt_slots: [
                { ...STATIC_SLOT, date: "2026-05-22", time: "13:30:00" },
                { ...STATIC_SLOT, date: "2026-05-22", time: "14:00:00" },
                { ...STATIC_SLOT, date: "2026-05-22", time: "14:30:00" },
              ],
            },
            { appt_date: "2026-05-23", appt_slots: [] as typeof STATIC_SLOT[] },
            { appt_date: "2026-05-24", appt_slots: [] as typeof STATIC_SLOT[] },
            {
              appt_date: "2026-05-25",
              appt_slots: [
                { ...STATIC_SLOT, date: "2026-05-25", time: "08:00:00" },
                { ...STATIC_SLOT, date: "2026-05-25", time: "08:30:00" },
                { ...STATIC_SLOT, date: "2026-05-25", time: "09:00:00" },
              ],
            },
            {
              appt_date: "2026-05-26",
              appt_slots: [
                { ...STATIC_SLOT, date: "2026-05-26", time: "08:30:00" },
                { ...STATIC_SLOT, date: "2026-05-26", time: "13:30:00" },
                { ...STATIC_SLOT, date: "2026-05-26", time: "14:00:00" },
              ],
            },
            {
              appt_date: "2026-05-27",
              appt_slots: [
                { ...STATIC_SLOT, date: "2026-05-27", time: "08:30:00" },
                { ...STATIC_SLOT, date: "2026-05-27", time: "09:00:00" },
                { ...STATIC_SLOT, date: "2026-05-27", time: "10:30:00" },
              ],
            },
            {
              appt_date: "2026-05-28",
              appt_slots: [
                { ...STATIC_SLOT, date: "2026-05-28", time: "08:00:00" },
                { ...STATIC_SLOT, date: "2026-05-28", time: "08:30:00" },
                { ...STATIC_SLOT, date: "2026-05-28", time: "09:30:00" },
              ],
            },
          ],
        },
        start_date: "2026-05-22",
      };

      const provSlots = response.prov_slots;
      const startDateOut = response.start_date ?? startDate;
      const endDateOut = response.end_date ?? "";
      const provApuId = provSlots.apu_id;

      const days = provSlots.appt_slots
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
            apuId: provApuId,
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
        startDate: startDateOut,
        endDate: endDateOut,
        days,
      };
    } catch (err) {
      return { error: (err as Error).message };
    }
  },
});
