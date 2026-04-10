"use client";

import { AlertCircleIcon, CheckCircle2, RefreshCwIcon, ShieldIcon } from "lucide-react";
import { useActiveChat } from "@/hooks/use-active-chat";

type VerificationSuccess = {
  verified: true;
  patientId: string;
  patientName: string;
  dateOfBirth: string;
  memberId: string;
  lastPharmacy: { id: string; name: string; address: string };
};

type VerificationFailure = {
  verified: false;
  message: string;
};

type PatientVerificationResultData = VerificationSuccess | VerificationFailure;

export function PatientVerificationResult({
  data,
}: {
  data: PatientVerificationResultData;
}) {
  const { sendMessage, isReadonly } = useActiveChat();

  const handleTryAgain = () => {
    if (isReadonly) return;
    sendMessage({
      role: "user",
      parts: [{ type: "text", text: "I'd like to try verifying my identity again" }],
    });
  };

  if (data.verified) {
    return (
      <div className="overflow-hidden rounded-2xl border border-emerald-500/20 bg-emerald-500/5 shadow-(--shadow-float)">
        <div className="flex items-center gap-2.5 border-b border-emerald-500/15 bg-emerald-500/10 px-4 py-3">
          <CheckCircle2 className="text-emerald-600 dark:text-emerald-400" size={16} />
          <span className="font-semibold text-emerald-700 text-sm dark:text-emerald-300">
            Identity Verified
          </span>
        </div>
        <div className="divide-y divide-emerald-500/10">
          <div className="flex items-center gap-3 px-4 py-2.5">
            <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 ring-1 ring-emerald-500/20">
              <ShieldIcon className="text-emerald-600 dark:text-emerald-400" size={12} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-muted-foreground/60 text-[10px] uppercase tracking-wider">
                Patient
              </div>
              <div className="truncate font-medium text-foreground text-xs">
                {data.patientName}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-2.5">
            <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 ring-1 ring-emerald-500/20">
              <ShieldIcon className="text-emerald-600 dark:text-emerald-400" size={12} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-muted-foreground/60 text-[10px] uppercase tracking-wider">
                Date of Birth
              </div>
              <div className="truncate font-medium text-foreground text-xs">
                {data.dateOfBirth}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-amber-500/20 bg-amber-500/5 shadow-(--shadow-float)">
      <div className="flex items-center gap-2.5 border-b border-amber-500/15 bg-amber-500/10 px-4 py-3">
        <AlertCircleIcon className="text-amber-600 dark:text-amber-400" size={16} />
        <span className="font-semibold text-amber-700 text-sm dark:text-amber-300">
          Verification Failed
        </span>
      </div>
      <div className="px-4 py-3">
        <p className="text-muted-foreground text-sm">{data.message}</p>
      </div>
      <div className="border-t border-amber-500/15 px-4 py-3">
        <button
          className={[
            "flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-medium transition-colors",
            isReadonly
              ? "cursor-default border-border/30 bg-muted/20 opacity-50 text-muted-foreground"
              : "cursor-pointer border-amber-500/30 bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 dark:text-amber-400",
          ].join(" ")}
          disabled={isReadonly}
          onClick={handleTryAgain}
          type="button"
        >
          <RefreshCwIcon size={11} />
          Try Again
        </button>
      </div>
    </div>
  );
}
