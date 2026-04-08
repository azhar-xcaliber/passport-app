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
import type { updateDocument } from "./ai/tools/update-document";
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
type createDocumentTool = InferUITool<ReturnType<typeof createDocument>>;
type updateDocumentTool = InferUITool<ReturnType<typeof updateDocument>>;
type requestSuggestionsTool = InferUITool<
  ReturnType<typeof requestSuggestions>
>;

export type ChatTools = {
  getWeather: weatherTool;
  getPatientAppointments: patientAppointmentsTool;
  getAvailableSlots: getAvailableSlotsTool;
  selectAppointmentType: selectAppointmentTypeTool;
  bookAppointment: bookAppointmentTool;
  createDocument: createDocumentTool;
  updateDocument: updateDocumentTool;
  requestSuggestions: requestSuggestionsTool;
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
