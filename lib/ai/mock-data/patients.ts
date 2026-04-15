// Shared mock patient data for both medication refill and appointment booking flows.
// All tools import from this single module to ensure consistency across flows.

export type MockPharmacy = {
  id: string;
  name: string;
  address: string;
};

export type MockMedication = {
  name: string;
  dosage: string;
  refillsRemaining: number;
  refillsTotal: number;
  lastFilled: string;
  daysSupply: number;
  prescribingDoctor: string;
};

export type MockInsurance = {
  provider: string;
  planId: string;
  groupNumber: string;
  memberId: string;
};

export type MockVisit = {
  date: string;
  doctor: string;
  location: string;
  reason: string;
};

export type MockPatient = {
  memberId: string;
  name: string;
  dob: string;
  patientId: string;
  // Medication refill fields
  lastPharmacy: MockPharmacy;
  medications: MockMedication[];
  // Appointment booking fields
  isReturning: boolean;
  lastDoctor: string | null;
  lastDoctorId: string | null; // provider_enc_npi
  lastDoctorNpi: string | null; // provider_npi (used by Healow API)
  lastLocation: string | null;
  lastLocationId: string | null;
  insurance: MockInsurance | null;
  visitHistory: MockVisit[];
};

// ─── Mock Patients ───────────────────────────────────────────────────────────

export const MOCK_PATIENTS: Record<string, MockPatient> = {
  // 1. Happy path: has refills, same pharmacy | Returning, same doctor/location fast-path
  "MEM-1001": {
    memberId: "MEM-1001",
    name: "Sarah Johnson",
    dob: "1985-03-15",
    patientId: "sarah-johnson",
    lastPharmacy: {
      id: "ph-001",
      name: "CVS Pharmacy - Main St",
      address: "123 Main St, Suite 100",
    },
    medications: [
      {
        name: "Lisinopril",
        dosage: "10mg",
        refillsRemaining: 3,
        refillsTotal: 6,
        lastFilled: "2026-03-01",
        daysSupply: 30,
        prescribingDoctor: "Gerald Ray, DO",
      },
      {
        name: "Metformin",
        dosage: "500mg",
        refillsRemaining: 5,
        refillsTotal: 12,
        lastFilled: "2026-03-15",
        daysSupply: 30,
        prescribingDoctor: "Gerald Ray, DO",
      },
    ],
    isReturning: true,
    lastDoctor: "Gerald Ray, DO",
    lastDoctorId: "gQdekM2bdXbOyVjp",
    lastDoctorNpi: "1720067119",
    lastLocation: "PRIMARY CARE MEDICINE ALLIANCE",
    lastLocationId: "210",
    insurance: {
      provider: "Blue Cross Blue Shield",
      planId: "BCBS-PPO-2024",
      groupNumber: "GRP-88721",
      memberId: "MEM-1001",
    },
    visitHistory: [
      {
        date: "2026-02-10",
        doctor: "Gerald Ray, DO",
        location: "PRIMARY CARE MEDICINE ALLIANCE",
        reason: "Annual Physical",
      },
      {
        date: "2025-11-05",
        doctor: "Gerald Ray, DO",
        location: "PRIMARY CARE MEDICINE ALLIANCE",
        reason: "Blood Pressure Follow-up",
      },
    ],
  },

  // 2. Fails verification first (name must be exact) | Returning, wants different location/doctor
  "MEM-2002": {
    memberId: "MEM-2002",
    name: "James Martinez",
    dob: "1990-07-22",
    patientId: "james-martinez",
    lastPharmacy: {
      id: "ph-002",
      name: "Walgreens - Oak Ave",
      address: "456 Oak Ave",
    },
    medications: [
      {
        name: "Atorvastatin",
        dosage: "20mg",
        refillsRemaining: 2,
        refillsTotal: 6,
        lastFilled: "2026-02-20",
        daysSupply: 30,
        prescribingDoctor: "Radhika Vayani, DO",
      },
    ],
    isReturning: true,
    lastDoctor: "Radhika Vayani, DO",
    lastDoctorId: "MpLVyW9jjlxoGrd5",
    lastDoctorNpi: "1396068870",
    lastLocation: "PRIMARY CARE MEDICINE AZLE",
    lastLocationId: "224",
    insurance: {
      provider: "Aetna",
      planId: "AET-HMO-2024",
      groupNumber: "GRP-44512",
      memberId: "MEM-2002",
    },
    visitHistory: [
      {
        date: "2026-01-15",
        doctor: "Radhika Vayani, DO",
        location: "PRIMARY CARE MEDICINE AZLE",
        reason: "Cholesterol Follow-up",
      },
    ],
  },

  // 3. No refills left | New patient, no history, no insurance
  "MEM-3003": {
    memberId: "MEM-3003",
    name: "Emily Chen",
    dob: "1978-11-08",
    patientId: "emily-chen",
    lastPharmacy: {
      id: "ph-003",
      name: "Rite Aid - Elm St",
      address: "789 Elm St",
    },
    medications: [
      {
        name: "Omeprazole",
        dosage: "20mg",
        refillsRemaining: 0,
        refillsTotal: 3,
        lastFilled: "2026-01-10",
        daysSupply: 30,
        prescribingDoctor: "Amy Mitchell, FNP",
      },
    ],
    isReturning: false,
    lastDoctor: null,
    lastDoctorId: null,
    lastDoctorNpi: null,
    lastLocation: null,
    lastLocationId: null,
    insurance: null,
    visitHistory: [],
  },

  // 4. Wants a different pharmacy | Returning, modifies appointment summary
  "MEM-4004": {
    memberId: "MEM-4004",
    name: "Robert Williams",
    dob: "1965-05-30",
    patientId: "robert-williams",
    lastPharmacy: {
      id: "ph-004",
      name: "CVS Pharmacy - Park Rd",
      address: "321 Park Rd",
    },
    medications: [
      {
        name: "Amlodipine",
        dosage: "5mg",
        refillsRemaining: 4,
        refillsTotal: 6,
        lastFilled: "2026-03-10",
        daysSupply: 30,
        prescribingDoctor: "Gerald Ray, DO",
      },
    ],
    isReturning: true,
    lastDoctor: "Amy Mitchell, FNP",
    lastDoctorId: "aLe2GNe84mOY7zg6",
    lastDoctorNpi: "1407485345",
    lastLocation: "PRIMARY CARE MEDICINE ALLIANCE",
    lastLocationId: "210",
    insurance: {
      provider: "UnitedHealthcare",
      planId: "UHC-EPO-2024",
      groupNumber: "GRP-67890",
      memberId: "MEM-4004",
    },
    visitHistory: [
      {
        date: "2026-03-01",
        doctor: "Amy Mitchell, FNP",
        location: "PRIMARY CARE MEDICINE ALLIANCE",
        reason: "Specialist Consultation",
      },
      {
        date: "2025-12-15",
        doctor: "Gerald Ray, DO",
        location: "PRIMARY CARE MEDICINE ALLIANCE",
        reason: "General Checkup",
      },
    ],
  },

  // 5. Multiple meds running low | Returning, missing insurance
  "MEM-5005": {
    memberId: "MEM-5005",
    name: "Maria Garcia",
    dob: "1972-09-18",
    patientId: "maria-garcia",
    lastPharmacy: {
      id: "ph-005",
      name: "Walgreens - Broadway",
      address: "555 Broadway",
    },
    medications: [
      {
        name: "Levothyroxine",
        dosage: "50mcg",
        refillsRemaining: 0,
        refillsTotal: 6,
        lastFilled: "2026-03-01",
        daysSupply: 30,
        prescribingDoctor: "Amy Mitchell, FNP",
      },
      {
        name: "Metoprolol",
        dosage: "25mg",
        refillsRemaining: 1,
        refillsTotal: 6,
        lastFilled: "2026-02-28",
        daysSupply: 30,
        prescribingDoctor: "Radhika Vayani, DO",
      },
      {
        name: "Hydrochlorothiazide",
        dosage: "12.5mg",
        refillsRemaining: 3,
        refillsTotal: 6,
        lastFilled: "2026-03-20",
        daysSupply: 30,
        prescribingDoctor: "Gerald Ray, DO",
      },
    ],
    isReturning: true,
    lastDoctor: "Amy Mitchell, FNP",
    lastDoctorId: "aLe2GNe84mOY7zg6",
    lastDoctorNpi: "1407485345",
    lastLocation: "PRIMARY CARE MEDICINE DENTON",
    lastLocationId: "225",
    insurance: null,
    visitHistory: [
      {
        date: "2026-02-20",
        doctor: "Amy Mitchell, FNP",
        location: "PRIMARY CARE MEDICINE DENTON",
        reason: "Thyroid Follow-up",
      },
      {
        date: "2025-10-10",
        doctor: "Radhika Vayani, DO",
        location: "PRIMARY CARE MEDICINE AZLE",
        reason: "Blood Pressure Management",
      },
    ],
  },

  // 6. Secondary: has refills, routine | New patient with insurance
  "MEM-6006": {
    memberId: "MEM-6006",
    name: "David Park",
    dob: "1988-04-12",
    patientId: "david-park",
    lastPharmacy: {
      id: "ph-006",
      name: "Rite Aid - Market St",
      address: "200 Market St",
    },
    medications: [
      {
        name: "Sertraline",
        dosage: "50mg",
        refillsRemaining: 4,
        refillsTotal: 6,
        lastFilled: "2026-03-05",
        daysSupply: 30,
        prescribingDoctor: "Morgan Perks, FNP",
      },
    ],
    isReturning: false,
    lastDoctor: null,
    lastDoctorId: null,
    lastDoctorNpi: null,
    lastLocation: null,
    lastLocationId: null,
    insurance: {
      provider: "Cigna",
      planId: "CIG-PPO-2024",
      groupNumber: "GRP-33210",
      memberId: "MEM-6006",
    },
    visitHistory: [],
  },

  // 7. Secondary: has refills, urgent | Returning, fast-path + insurance image demo
  "MEM-7007": {
    memberId: "MEM-7007",
    name: "Lisa Nguyen",
    dob: "1995-01-25",
    patientId: "lisa-nguyen",
    lastPharmacy: {
      id: "ph-007",
      name: "CVS Pharmacy - College Ave",
      address: "800 College Ave",
    },
    medications: [
      {
        name: "Albuterol Inhaler",
        dosage: "90mcg",
        refillsRemaining: 1,
        refillsTotal: 3,
        lastFilled: "2026-02-15",
        daysSupply: 30,
        prescribingDoctor: "Morgan Perks, FNP",
      },
    ],
    isReturning: true,
    lastDoctor: "Gerald Ray, DO",
    lastDoctorId: "gQdekM2bdXbOyVjp",
    lastDoctorNpi: "1720067119",
    lastLocation: "PRIMARY CARE MEDICINE-KELLER",
    lastLocationId: "227",
    insurance: {
      provider: "Anthem",
      planId: "ANT-PPO-2024",
      groupNumber: "GRP-55890",
      memberId: "MEM-7007",
    },
    visitHistory: [
      {
        date: "2026-01-20",
        doctor: "Gerald Ray, DO",
        location: "PRIMARY CARE MEDICINE DENTON",
        reason: "Asthma Follow-up",
      },
    ],
  },

  // 8. Secondary: multiple meds, some expired | Returning, multiple modification loops
  "MEM-8008": {
    memberId: "MEM-8008",
    name: "Ahmed Hassan",
    dob: "1960-12-03",
    patientId: "ahmed-hassan",
    lastPharmacy: {
      id: "ph-008",
      name: "Walgreens - River Rd",
      address: "150 River Rd",
    },
    medications: [
      {
        name: "Metformin",
        dosage: "1000mg",
        refillsRemaining: 0,
        refillsTotal: 6,
        lastFilled: "2025-12-01",
        daysSupply: 30,
        prescribingDoctor: "Radhika Vayani, DO",
      },
      {
        name: "Glipizide",
        dosage: "5mg",
        refillsRemaining: 2,
        refillsTotal: 6,
        lastFilled: "2026-02-25",
        daysSupply: 30,
        prescribingDoctor: "Radhika Vayani, DO",
      },
      {
        name: "Losartan",
        dosage: "50mg",
        refillsRemaining: 1,
        refillsTotal: 6,
        lastFilled: "2026-03-01",
        daysSupply: 30,
        prescribingDoctor: "Amy Mitchell, FNP",
      },
    ],
    isReturning: true,
    lastDoctor: "Radhika Vayani, DO",
    lastDoctorId: "MpLVyW9jjlxoGrd5",
    lastDoctorNpi: "1396068870",
    lastLocation: "PRIMARY CARE MEDICINE AZLE",
    lastLocationId: "224",
    insurance: {
      provider: "Medicare",
      planId: "MCR-ADV-2024",
      groupNumber: "GRP-MC-001",
      memberId: "MEM-8008",
    },
    visitHistory: [
      {
        date: "2026-02-01",
        doctor: "Radhika Vayani, DO",
        location: "PRIMARY CARE MEDICINE AZLE",
        reason: "Diabetes Management",
      },
      {
        date: "2025-11-15",
        doctor: "Amy Mitchell, FNP",
        location: "PRIMARY CARE MEDICINE ALLIANCE",
        reason: "Hypertension Follow-up",
      },
      {
        date: "2025-08-20",
        doctor: "Radhika Vayani, DO",
        location: "PRIMARY CARE MEDICINE AZLE",
        reason: "Lab Review",
      },
    ],
  },
};

// ─── Lookup Helpers ──────────────────────────────────────────────────────────

/** Case-insensitive name match + exact DOB match. */
export function findPatient(name: string, dob: string): MockPatient | null {
  return (
    Object.values(MOCK_PATIENTS).find(
      (p) => p.name.toLowerCase() === name.toLowerCase() && p.dob === dob
    ) ?? null
  );
}

/** Find patient by patientId (used after verification). */
export function findPatientById(patientId: string): MockPatient | null {
  return (
    Object.values(MOCK_PATIENTS).find((p) => p.patientId === patientId) ?? null
  );
}

// ─── Nearby Pharmacies ───────────────────────────────────────────────────────

export type NearbyPharmacy = {
  id: string;
  name: string;
  address: string;
  distance: string;
  hours: string;
  hasDelivery: boolean;
};

export const NEARBY_PHARMACIES: NearbyPharmacy[] = [
  {
    id: "nph-001",
    name: "CVS Pharmacy - Main St",
    address: "123 Main St, Suite 100",
    distance: "0.3 mi",
    hours: "8:00 AM - 10:00 PM",
    hasDelivery: true,
  },
  {
    id: "nph-002",
    name: "Walgreens - Oak Ave",
    address: "456 Oak Ave",
    distance: "0.7 mi",
    hours: "7:00 AM - 11:00 PM",
    hasDelivery: true,
  },
  {
    id: "nph-003",
    name: "Rite Aid - Elm St",
    address: "789 Elm St",
    distance: "1.1 mi",
    hours: "8:00 AM - 9:00 PM",
    hasDelivery: false,
  },
  {
    id: "nph-004",
    name: "Costco Pharmacy",
    address: "1200 Commerce Blvd",
    distance: "1.8 mi",
    hours: "10:00 AM - 7:00 PM",
    hasDelivery: false,
  },
  {
    id: "nph-005",
    name: "Walmart Pharmacy",
    address: "3400 Retail Way",
    distance: "2.3 mi",
    hours: "9:00 AM - 9:00 PM",
    hasDelivery: true,
  },
  {
    id: "nph-006",
    name: "Express Scripts Mail Pharmacy",
    address: "Mail Order Service",
    distance: "N/A",
    hours: "24/7 Online",
    hasDelivery: true,
  },
];

// ─── Clinic Locations ────────────────────────────────────────────────────────

export type ClinicLocation = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  timezone: string;
};

export const CLINIC_LOCATIONS: ClinicLocation[] = [
  {
    id: "210",
    name: "PRIMARY CARE MEDICINE ALLIANCE",
    address: "3800 NORTH TARRANT PARKWAY, Suite 210, FORT WORTH, TX 76244",
    lat: 32.934_024,
    lng: -97.250_604,
    timezone: "CST",
  },
  {
    id: "224",
    name: "PRIMARY CARE MEDICINE AZLE",
    address: "721 SOUTHEAST PKWY, AZLE, TX 76020",
    lat: 32.91,
    lng: -97.557_24,
    timezone: "CST",
  },
  {
    id: "225",
    name: "PRIMARY CARE MEDICINE DENTON",
    address: "3200 COLORADO BLVD, STE 202, DENTON, TX 76210",
    lat: 33.145_623,
    lng: -97.090_468,
    timezone: "CST",
  },
  {
    id: "226",
    name: "PRIMARY CARE BRIDGEPORT",
    address: "808 WOODROW WILSON RAY CIR, BRIDGEPORT, TX 76426",
    lat: 33.151_387,
    lng: -97.821_373,
    timezone: "CST",
  },
  {
    id: "227",
    name: "PRIMARY CARE MEDICINE-KELLER",
    address: "601 S MAIN ST, STE 200, KELLER, TX 76248",
    lat: 32.930_266,
    lng: -97.247_254,
    timezone: "CST",
  },
  {
    id: "229",
    name: "PRIMARY CARE SAGINAW",
    address: "709 W BAILEY BOSWELL RD, FORT WORTH, TX 76179",
    lat: 32.9064,
    lng: -97.433_22,
    timezone: "CST",
  },
];

// ─── All Doctors ─────────────────────────────────────────────────────────────

export type Doctor = {
  id: string; // provider_enc_npi
  npi: string;
  name: string;
  degree: string;
  gender: string;
  specialty: string;
  acceptingNewPatients: boolean;
  languages: string;
  bio: string;
};

export const ALL_DOCTORS: Doctor[] = [
  {
    id: "aLe2GNe84mOY7zg6",
    npi: "1407485345",
    name: "Amy Mitchell",
    degree: "FNP",
    gender: "female",
    specialty: "Nurse Practitioner",
    acceptingNewPatients: true,
    languages: "English",
    bio: "Amy brings a broad clinical background that includes Emergency Medicine, Urgent Care, and Primary Care across the lifespan, caring for adults, adolescents, and pediatric patients. She is especially passionate about patient education and preventive care, striving to empower her patients, family, and community to live healthier lives every day.",
  },
  {
    id: "gQdekM2bdXbOyVjp",
    npi: "1720067119",
    name: "Gerald Ray",
    degree: "DO",
    gender: "male",
    specialty: "Family Medicine",
    acceptingNewPatients: true,
    languages: "English",
    bio: "Dr. Ray is board certified in family practice/omt and graduated from University of Texas at Austin Dell Medical School in 1996 and has 29 years experience as a Family Care Physician.",
  },
  {
    id: "QYLry2ARO68zkn3b",
    npi: "1174027999",
    name: "Morgan Perks",
    degree: "FNP",
    gender: "female",
    specialty: "Nurse Practitioner-Family",
    acceptingNewPatients: true,
    languages: "English",
    bio: "Morgan is a Family Nurse Practioner who graduated from Walden University with Master's in Nursing and is certified Family Nurse Practioner. Morgan has been in Practice as a Family Nurse Practioner for 3 years.",
  },
  {
    id: "MpLVyW9jjlxoGrd5",
    npi: "1396068870",
    name: "Radhika Vayani",
    degree: "DO",
    gender: "female",
    specialty: "Internal Medicine",
    acceptingNewPatients: true,
    languages: "English",
    bio: "Dr. Radhika Vayani is a warm and compassionate primary care doctor specializing in internal medicine caters to the communities of Fort Worth and Keller Texas.",
  },
];

// Mapping of which doctors are available at each clinic location
export const DOCTORS_BY_LOCATION: Record<string, string[]> = {
  "210": ["aLe2GNe84mOY7zg6", "gQdekM2bdXbOyVjp", "MpLVyW9jjlxoGrd5"], // Alliance
  "224": ["gQdekM2bdXbOyVjp", "QYLry2ARO68zkn3b", "MpLVyW9jjlxoGrd5"], // Azle
  "225": ["aLe2GNe84mOY7zg6", "QYLry2ARO68zkn3b", "gQdekM2bdXbOyVjp"], // Denton
  "226": ["MpLVyW9jjlxoGrd5", "gQdekM2bdXbOyVjp", "QYLry2ARO68zkn3b"], // Bridgeport
  "227": [
    "aLe2GNe84mOY7zg6",
    "gQdekM2bdXbOyVjp",
    "QYLry2ARO68zkn3b",
    "MpLVyW9jjlxoGrd5",
  ], // Keller
  "229": ["aLe2GNe84mOY7zg6", "MpLVyW9jjlxoGrd5", "QYLry2ARO68zkn3b"], // Saginaw
};
