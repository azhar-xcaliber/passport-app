"use client";

import {
  CheckCircle2,
  CreditCardIcon,
  ShieldIcon,
  UploadIcon,
} from "lucide-react";
import { useActiveChat } from "@/hooks/use-active-chat";

type InsuranceDetails = {
  provider: string;
  planId: string;
  groupNumber: string;
  memberId: string;
};

type InsuranceInfoData =
  | { patientId: string; patientName: string; hasInsurance: true; insurance: InsuranceDetails }
  | { patientId: string; patientName: string; hasInsurance: false; insurance: null };

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5">
      <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-sky-500/10 ring-1 ring-sky-500/20">
        <ShieldIcon className="text-sky-600 dark:text-sky-400" size={12} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-muted-foreground/60 text-[10px] uppercase tracking-wider">
          {label}
        </div>
        <div className="truncate font-medium text-foreground text-xs">{value}</div>
      </div>
    </div>
  );
}

export function InsuranceInfo({ data }: { data: InsuranceInfoData }) {
  const { sendMessage, isReadonly } = useActiveChat();

  const handleConfirm = () => {
    if (isReadonly) return;
    sendMessage({
      role: "user",
      parts: [{ type: "text", text: "My insurance information looks correct" }],
    });
  };

  const handleEnterDetails = () => {
    if (isReadonly) return;
    sendMessage({
      role: "user",
      parts: [{ type: "text", text: "I'd like to enter my insurance details" }],
    });
  };

  const handleUploadCard = () => {
    if (isReadonly) return;
    sendMessage({
      role: "user",
      parts: [{ type: "text", text: "I'd like to upload a photo of my insurance card" }],
    });
  };

  if (data.hasInsurance) {
    return (
      <div className="overflow-hidden rounded-2xl border border-sky-500/20 bg-sky-500/5 shadow-(--shadow-float)">
        <div className="flex items-center gap-2.5 border-b border-sky-500/15 bg-sky-500/10 px-4 py-3">
          <ShieldIcon className="text-sky-600 dark:text-sky-400" size={16} />
          <span className="font-semibold text-sky-700 text-sm dark:text-sky-300">
            Insurance on File
          </span>
        </div>
        <div className="divide-y divide-sky-500/10">
          <Row label="Provider" value={data.insurance.provider} />
          <Row label="Plan ID" value={data.insurance.planId} />
          <Row label="Group Number" value={data.insurance.groupNumber} />
          <Row label="Member ID" value={data.insurance.memberId} />
        </div>
        <div className="border-t border-sky-500/15 px-4 py-3">
          <button
            className={[
              "flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-medium transition-colors",
              isReadonly
                ? "cursor-default border-border/30 bg-muted/20 opacity-50 text-muted-foreground"
                : "cursor-pointer border-sky-500/30 bg-sky-500/10 text-sky-700 hover:bg-sky-500/20 dark:text-sky-400",
            ].join(" ")}
            disabled={isReadonly}
            onClick={handleConfirm}
            type="button"
          >
            <CheckCircle2 size={11} />
            Looks correct
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-(--shadow-float)">
      <div className="flex items-center gap-2.5 border-b border-border/30 bg-muted/50 px-4 py-3">
        <CreditCardIcon className="text-muted-foreground" size={16} />
        <span className="font-semibold text-foreground text-sm">
          No Insurance on File
        </span>
      </div>
      <div className="px-4 py-3">
        <p className="text-muted-foreground text-xs">
          We don&apos;t have insurance information on file for {data.patientName}. You can
          provide your details now or continue without insurance.
        </p>
      </div>
      <div className="flex flex-wrap gap-2 border-t border-border/30 px-4 py-3">
        <button
          className={[
            "flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-medium transition-colors",
            isReadonly
              ? "cursor-default border-border/30 bg-muted/20 opacity-50 text-muted-foreground"
              : "cursor-pointer border-border/50 bg-card/30 text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary",
          ].join(" ")}
          disabled={isReadonly}
          onClick={handleEnterDetails}
          type="button"
        >
          <CreditCardIcon size={11} />
          Enter insurance details
        </button>
        <button
          className={[
            "flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-medium transition-colors",
            isReadonly
              ? "cursor-default border-border/30 bg-muted/20 opacity-50 text-muted-foreground"
              : "cursor-pointer border-border/50 bg-card/30 text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary",
          ].join(" ")}
          disabled={isReadonly}
          onClick={handleUploadCard}
          type="button"
        >
          <UploadIcon size={11} />
          Upload insurance card
        </button>
      </div>
    </div>
  );
}
