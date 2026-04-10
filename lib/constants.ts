import { generateDummyPassword } from "./db/utils";

export const isProductionEnvironment = process.env.NODE_ENV === "production";
export const isDevelopmentEnvironment = process.env.NODE_ENV === "development";
export const isTestEnvironment = Boolean(
  process.env.PLAYWRIGHT_TEST_BASE_URL ||
    process.env.PLAYWRIGHT ||
    process.env.CI_PLAYWRIGHT
);

export const guestRegex = /^guest-\d+$/;

export const DUMMY_PASSWORD = generateDummyPassword();

export const suggestions = [
  "What are the advantages of using Next.js?",
  "Write code to demonstrate Dijkstra's algorithm",
  "Help me write an essay about Silicon Valley",
  "What is the weather in San Francisco?",
];

export const contextSuggestions: Record<string, string[]> = {
  "Schedule an Appointment": [
    "I'd like to book an appointment",
    "I need to book an appointment as a new patient",
    "I'd like to schedule a follow-up visit",
    "I need to book an appointment for a wellness check-up",
  ],
  "View Care Team": [
    "Who is my primary care physician?",
    "Show me my current care team",
    "How do I change my primary care doctor?",
    "What are my doctor's office hours?",
  ],
  "View Visits": [
    "Show me my recent visit summaries",
    "I need a copy of my last visit notes",
    "What were the results from my last appointment?",
    "Can I see my visit history for the past year?",
  ],
  Immunizations: [
    "What immunizations am I due for?",
    "Show me my vaccination history",
    "I need to get a flu shot, where can I go?",
    "Are my children's immunizations up to date?",
  ],
  "Request Refills": [
    "I need to refill my medications",
    "I'd like to refill a prescription",
    "I need a refill but I'm not sure I have any left",
    "I'd like to refill and use a different pharmacy",
  ],
  "View and Pay Bill": [
    "Show me my current balance",
    "I want to pay my outstanding bill",
    "Can I set up a payment plan?",
    "I have a question about a recent charge",
  ],
  "Financial Assistance": [
    "What financial assistance programs are available?",
    "How do I apply for charity care?",
    "Do you offer sliding scale payment options?",
    "I'm having trouble paying my medical bills",
  ],
};
