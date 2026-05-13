import { tool } from "ai";
import { z } from "zod";

const STATIC_FAC_LIST = [
  {
    fac_id: 210,
    name: "BE WELL PRIMARY CARE MEDICINE ALLIANCE",
    address1: "3800 NORTH TARRANT PARKWAY",
    address2: "Suite 210",
    city: "FORT WORTH",
    state: "TX",
    zip: "76244",
    lat: 32.934_024,
    lng: -97.250_604,
    facility_time_zone: "CST",
  },
  {
    fac_id: 224,
    name: "BE WELL PRIMARY CARE MEDICINE AZLE",
    address1: "721 SOUTHEAST PKWY",
    address2: "",
    city: "AZLE",
    state: "TX",
    zip: "76020",
    lat: 32.91,
    lng: -97.557_24,
    facility_time_zone: "CST",
  },
  {
    fac_id: 225,
    name: "BE WELL PRIMARY CARE MEDICINE DENTON",
    address1: "3200 COLORADO BLVD",
    address2: "STE 202",
    city: "DENTON",
    state: "TX",
    zip: "76210",
    lat: 33.145_623,
    lng: -97.090_468,
    facility_time_zone: "CST",
  },
  {
    fac_id: 226,
    name: "BE WELL PRIMARY CARE BRIDGEPORT",
    address1: "808 WOODROW WILSON RAY CIR",
    address2: "",
    city: "BRIDGEPORT",
    state: "TX",
    zip: "76426",
    lat: 33.151_387,
    lng: -97.821_373,
    facility_time_zone: "CST",
  },
  {
    fac_id: 227,
    name: "BE WELL PRIMARY CARE MEDICINE-KELLER",
    address1: "601 S MAIN ST",
    address2: "STE 200",
    city: "KELLER",
    state: "TX",
    zip: "76248",
    lat: 32.930_266,
    lng: -97.247_254,
    facility_time_zone: "CST",
  },
  {
    fac_id: 229,
    name: "BE WELL PRIMARY CARE SAGINAW",
    address1: "709 W BAILEY BOSWELL RD",
    address2: "",
    city: "FORT WORTH",
    state: "TX",
    zip: "76179",
    lat: 32.9064,
    lng: -97.433_22,
    facility_time_zone: "CST",
  },
];

export const getClinicLocations = tool({
  description:
    "Retrieve the list of available clinic locations for booking an appointment. Call this when the patient needs to select a location (new patient, or returning patient who wants a different location).",
  inputSchema: z.object({
    patientId: z.string().describe("The verified patient's unique identifier"),
  }),
  execute: ({ patientId }) => {
    const locations = STATIC_FAC_LIST.map((fac) => ({
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
  },
});
