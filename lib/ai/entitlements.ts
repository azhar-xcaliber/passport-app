import type { UserType } from "@/app/(auth)/auth";

type Entitlements = {
  maxMessagesPerHour: number;
};

export const entitlementsByUserType: Record<UserType, Entitlements> = {
  guest: {
    maxMessagesPerHour: 10_000, // Set to -1 for unlimited messages, or set to a positive number for rate limiting.
  },
  regular: {
    maxMessagesPerHour: 10_000, // Set to -1 for unlimited messages, or set to a positive number for rate limiting.
  },
};
