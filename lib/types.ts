import type { InferUITool, UIMessage } from "ai";
import { z } from "zod";
import type { ArtifactKind } from "@/components/chat/artifact";
import type { bookAppointment } from "./ai/tools/book-appointment";
import type { createDocument } from "./ai/tools/create-document";
import type { getAvailableSlots } from "./ai/tools/get-available-slots";
import type { getPatientAppointments } from "./ai/tools/get-patient-appointments";
import type { getWeather } from "./ai/tools/get-weather";
import type { requestSuggestions } from "./ai/tools/request-suggestions";
import type { selectAppointmentType } from "./ai/tools/select-appointment-type";
import type { processRefillRequest } from "./ai/tools/process-refill-request";
import type { submitRefillRequest } from "./ai/tools/submit-refill-request";
import type { updateDocument } from "./ai/tools/update-document";
import type { verifyPatientIdentity } from "./ai/tools/verify-patient-identity";
import type { getPatientMedications } from "./ai/tools/get-patient-medications";
import type { getNearbyPharmacies } from "./ai/tools/get-nearby-pharmacies";
import type { getPatientHistory } from "./ai/tools/get-patient-history";
import type { getClinicLocations } from "./ai/tools/get-clinic-locations";
import type { getDoctorsAtLocation } from "./ai/tools/get-doctors-at-location";
import type { getPatientInsurance } from "./ai/tools/get-patient-insurance";
import type { showAppointmentSummary } from "./ai/tools/show-appointment-summary";
import type { Suggestion } from "./db/schema";

export const messageMetadataSchema = z.object({
  createdAt: z.string(),
});

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;

type weatherTool = InferUITool<typeof getWeather>;
type patientAppointmentsTool = InferUITool<typeof getPatientAppointments>;
type getAvailableSlotsTool = InferUITool<typeof getAvailableSlots>;
type selectAppointmentTypeTool = InferUITool<typeof selectAppointmentType>;
type bookAppointmentTool = InferUITool<typeof bookAppointment>;
type processRefillRequestTool = InferUITool<typeof processRefillRequest>;
type submitRefillRequestTool = InferUITool<typeof submitRefillRequest>;
type createDocumentTool = InferUITool<ReturnType<typeof createDocument>>;
type updateDocumentTool = InferUITool<ReturnType<typeof updateDocument>>;
type requestSuggestionsTool = InferUITool<ReturnType<typeof requestSuggestions>>;
type verifyPatientIdentityTool = InferUITool<typeof verifyPatientIdentity>;
type getPatientMedicationsTool = InferUITool<typeof getPatientMedications>;
type getNearbyPharmaciesTool = InferUITool<typeof getNearbyPharmacies>;
type getPatientHistoryTool = InferUITool<typeof getPatientHistory>;
type getClinicLocationsTool = InferUITool<typeof getClinicLocations>;
type getDoctorsAtLocationTool = InferUITool<typeof getDoctorsAtLocation>;
type getPatientInsuranceTool = InferUITool<typeof getPatientInsurance>;
type showAppointmentSummaryTool = InferUITool<typeof showAppointmentSummary>;

export type ChatTools = {
  getWeather: weatherTool;
  getPatientAppointments: patientAppointmentsTool;
  getAvailableSlots: getAvailableSlotsTool;
  selectAppointmentType: selectAppointmentTypeTool;
  bookAppointment: bookAppointmentTool;
  processRefillRequest: processRefillRequestTool;
  submitRefillRequest: submitRefillRequestTool;
  createDocument: createDocumentTool;
  updateDocument: updateDocumentTool;
  requestSuggestions: requestSuggestionsTool;
  verifyPatientIdentity: verifyPatientIdentityTool;
  getPatientMedications: getPatientMedicationsTool;
  getNearbyPharmacies: getNearbyPharmaciesTool;
  getPatientHistory: getPatientHistoryTool;
  getClinicLocations: getClinicLocationsTool;
  getDoctorsAtLocation: getDoctorsAtLocationTool;
  getPatientInsurance: getPatientInsuranceTool;
  showAppointmentSummary: showAppointmentSummaryTool;
};

export type CustomUIDataTypes = {
  textDelta: string;
  imageDelta: string;
  sheetDelta: string;
  codeDelta: string;
  suggestion: Suggestion;
  appendMessage: string;
  id: string;
  title: string;
  kind: ArtifactKind;
  clear: null;
  finish: null;
  "chat-title": string;
};

export type ChatMessage = UIMessage<
  MessageMetadata,
  CustomUIDataTypes,
  ChatTools
>;

export type Attachment = {
  name: string;
  url: string;
  contentType: string;
};
