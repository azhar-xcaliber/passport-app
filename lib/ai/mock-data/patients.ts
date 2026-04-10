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
  lastDoctorId: string | null;
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
        prescribingDoctor: "Dr. Sarah Chen",
      },
      {
        name: "Metformin",
        dosage: "500mg",
        refillsRemaining: 5,
        refillsTotal: 12,
        lastFilled: "2026-03-15",
        daysSupply: 30,
        prescribingDoctor: "Dr. Sarah Chen",
      },
    ],
    isReturning: true,
    lastDoctor: "Dr. Sarah Chen",
    lastDoctorId: "prov-001",
    lastLocation: "Downtown Medical Center",
    lastLocationId: "loc-001",
    insurance: {
      provider: "Blue Cross Blue Shield",
      planId: "BCBS-PPO-2024",
      groupNumber: "GRP-88721",
      memberId: "MEM-1001",
    },
    visitHistory: [
      {
        date: "2026-02-10",
        doctor: "Dr. Sarah Chen",
        location: "Downtown Medical Center",
        reason: "Annual Physical",
      },
      {
        date: "2025-11-05",
        doctor: "Dr. Sarah Chen",
        location: "Downtown Medical Center",
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
        prescribingDoctor: "Dr. Michael Torres",
      },
    ],
    isReturning: true,
    lastDoctor: "Dr. Michael Torres",
    lastDoctorId: "prov-002",
    lastLocation: "Westside Health Clinic",
    lastLocationId: "loc-002",
    insurance: {
      provider: "Aetna",
      planId: "AET-HMO-2024",
      groupNumber: "GRP-44512",
      memberId: "MEM-2002",
    },
    visitHistory: [
      {
        date: "2026-01-15",
        doctor: "Dr. Michael Torres",
        location: "Westside Health Clinic",
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
        prescribingDoctor: "Dr. Aisha Patel",
      },
    ],
    isReturning: false,
    lastDoctor: null,
    lastDoctorId: null,
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
        prescribingDoctor: "Dr. Sarah Chen",
      },
    ],
    isReturning: true,
    lastDoctor: "Dr. Aisha Patel",
    lastDoctorId: "prov-003",
    lastLocation: "Downtown Medical Center",
    lastLocationId: "loc-001",
    insurance: {
      provider: "UnitedHealthcare",
      planId: "UHC-EPO-2024",
      groupNumber: "GRP-67890",
      memberId: "MEM-4004",
    },
    visitHistory: [
      {
        date: "2026-03-01",
        doctor: "Dr. Aisha Patel",
        location: "Downtown Medical Center",
        reason: "Specialist Consultation",
      },
      {
        date: "2025-12-15",
        doctor: "Dr. Sarah Chen",
        location: "Downtown Medical Center",
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
        refillsRemaining: 2,
        refillsTotal: 6,
        lastFilled: "2026-03-01",
        daysSupply: 30,
        prescribingDoctor: "Dr. Aisha Patel",
      },
      {
        name: "Metoprolol",
        dosage: "25mg",
        refillsRemaining: 1,
        refillsTotal: 6,
        lastFilled: "2026-02-28",
        daysSupply: 30,
        prescribingDoctor: "Dr. Michael Torres",
      },
      {
        name: "Hydrochlorothiazide",
        dosage: "12.5mg",
        refillsRemaining: 3,
        refillsTotal: 6,
        lastFilled: "2026-03-20",
        daysSupply: 30,
        prescribingDoctor: "Dr. Sarah Chen",
      },
    ],
    isReturning: true,
    lastDoctor: "Dr. Aisha Patel",
    lastDoctorId: "prov-003",
    lastLocation: "Northside Family Practice",
    lastLocationId: "loc-003",
    insurance: null,
    visitHistory: [
      {
        date: "2026-02-20",
        doctor: "Dr. Aisha Patel",
        location: "Northside Family Practice",
        reason: "Thyroid Follow-up",
      },
      {
        date: "2025-10-10",
        doctor: "Dr. Michael Torres",
        location: "Westside Health Clinic",
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
        prescribingDoctor: "Dr. Lisa Nguyen",
      },
    ],
    isReturning: false,
    lastDoctor: null,
    lastDoctorId: null,
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
        prescribingDoctor: "Dr. David Kim",
      },
    ],
    isReturning: true,
    lastDoctor: "Dr. Sarah Chen",
    lastDoctorId: "prov-001",
    lastLocation: "Northside Family Practice",
    lastLocationId: "loc-003",
    insurance: {
      provider: "Anthem",
      planId: "ANT-PPO-2024",
      groupNumber: "GRP-55890",
      memberId: "MEM-7007",
    },
    visitHistory: [
      {
        date: "2026-01-20",
        doctor: "Dr. Sarah Chen",
        location: "Northside Family Practice",
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
        prescribingDoctor: "Dr. Michael Torres",
      },
      {
        name: "Glipizide",
        dosage: "5mg",
        refillsRemaining: 2,
        refillsTotal: 6,
        lastFilled: "2026-02-25",
        daysSupply: 30,
        prescribingDoctor: "Dr. Michael Torres",
      },
      {
        name: "Losartan",
        dosage: "50mg",
        refillsRemaining: 1,
        refillsTotal: 6,
        lastFilled: "2026-03-01",
        daysSupply: 30,
        prescribingDoctor: "Dr. Aisha Patel",
      },
    ],
    isReturning: true,
    lastDoctor: "Dr. Michael Torres",
    lastDoctorId: "prov-002",
    lastLocation: "Westside Health Clinic",
    lastLocationId: "loc-002",
    insurance: {
      provider: "Medicare",
      planId: "MCR-ADV-2024",
      groupNumber: "GRP-MC-001",
      memberId: "MEM-8008",
    },
    visitHistory: [
      {
        date: "2026-02-01",
        doctor: "Dr. Michael Torres",
        location: "Westside Health Clinic",
        reason: "Diabetes Management",
      },
      {
        date: "2025-11-15",
        doctor: "Dr. Aisha Patel",
        location: "Downtown Medical Center",
        reason: "Hypertension Follow-up",
      },
      {
        date: "2025-08-20",
        doctor: "Dr. Michael Torres",
        location: "Westside Health Clinic",
        reason: "Lab Review",
      },
    ],
  },
};

// ─── Lookup Helpers ──────────────────────────────────────────────────────────

/** Case-insensitive name match + exact DOB and memberId match. */
export function findPatient(
  name: string,
  dob: string,
  memberId: string
): MockPatient | null {
  const patient = MOCK_PATIENTS[memberId.toUpperCase()];
  if (!patient) return null;
  if (patient.name.toLowerCase() !== name.toLowerCase()) return null;
  if (patient.dob !== dob) return null;
  return patient;
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
  phone: string;
};

export const CLINIC_LOCATIONS: ClinicLocation[] = [
  {
    id: "loc-001",
    name: "Downtown Medical Center",
    address: "100 Main St, Suite 200",
    phone: "(555) 100-2000",
  },
  {
    id: "loc-002",
    name: "Westside Health Clinic",
    address: "450 West Blvd",
    phone: "(555) 200-3000",
  },
  {
    id: "loc-003",
    name: "Northside Family Practice",
    address: "789 North Ave",
    phone: "(555) 300-4000",
  },
  {
    id: "loc-004",
    name: "Lakefront Medical Group",
    address: "55 Lakeshore Dr",
    phone: "(555) 400-5000",
  },
];

// ─── All Doctors ─────────────────────────────────────────────────────────────

export type Doctor = {
  id: string;
  name: string;
  specialty: string;
};

export const ALL_DOCTORS: Doctor[] = [
  { id: "prov-001", name: "Dr. Sarah Chen", specialty: "Primary Care" },
  {
    id: "prov-002",
    name: "Dr. Michael Torres",
    specialty: "Internal Medicine",
  },
  { id: "prov-003", name: "Dr. Aisha Patel", specialty: "Family Medicine" },
  { id: "prov-004", name: "Dr. David Kim", specialty: "General Practice" },
  { id: "prov-005", name: "Dr. Lisa Nguyen", specialty: "Internal Medicine" },
  { id: "prov-006", name: "Dr. James Wilson", specialty: "Family Medicine" },
];

// Mapping of which doctors are available at each clinic location
export const DOCTORS_BY_LOCATION: Record<string, string[]> = {
  "loc-001": ["prov-001", "prov-003", "prov-004"], // Downtown
  "loc-002": ["prov-002", "prov-005", "prov-006"], // Westside
  "loc-003": ["prov-001", "prov-003", "prov-006"], // Northside
  "loc-004": ["prov-002", "prov-004", "prov-005"], // Lakefront
};
