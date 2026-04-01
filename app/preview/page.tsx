"use client";

import { useState } from "react";
import { DataStreamProvider } from "@/components/chat/data-stream-provider";
import { PreviewMessage } from "@/components/chat/message";
import type { ChatMessage } from "@/lib/types";

const EXAMPLE_JSON = `{
  "messages": [
    { "role": "user", "content": "What's the weather like in San Francisco?" },
    {
      "role": "assistant",
      "parts": [
        { "type": "text", "text": "Here's the current weather in San Francisco:" },
        {
          "type": "tool-getWeather",
          "toolCallId": "weather_1",
          "state": "output-available",
          "input": { "city": "San Francisco" },
          "output": null
        }
      ]
    }
  ]
}`;

// For tool parts, null output means "use the component's built-in sample data".
// PreviewMessage passes output directly to <Weather weatherAtLocation={output} />,
// and Weather defaults to its SAMPLE constant when output is undefined.
function normalizeParts(parts: unknown[]): unknown[] {
  return parts.map((part) => {
    const p = part as Record<string, unknown>;
    if (
      typeof p.type === "string" &&
      p.type.startsWith("tool-") &&
      p.output === null
    ) {
      const { output: _output, ...rest } = p;
      return rest;
    }
    return p;
  });
}

function parseJsonToMessages(json: string): ChatMessage[] {
  const parsed = JSON.parse(json);
  if (!Array.isArray(parsed.messages)) {
    throw new Error('JSON must have a "messages" array');
  }
  return parsed.messages.map(
    (m: { role: string; content?: string; parts?: unknown[] }, i: number) => {
      if (m.role !== "user" && m.role !== "assistant") {
        throw new Error(
          `Message at index ${i} has invalid role "${m.role}". Must be "user" or "assistant".`
        );
      }
      const rawParts = m.parts ?? [{ type: "text", text: m.content ?? "" }];
      return {
        id: `preview-${i}`,
        role: m.role as "user" | "assistant",
        parts: normalizeParts(rawParts),
        metadata: { createdAt: new Date().toISOString() },
      };
    }
  );
}

const noop = () => {};

export default function PreviewPage() {
  const [jsonInput, setJsonInput] = useState(EXAMPLE_JSON);
  const [messages, setPreviewMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasPreview, setHasPreview] = useState(false);

  function handlePreview() {
    setError(null);
    try {
      const parsed = parseJsonToMessages(jsonInput);
      setPreviewMessages(parsed);
      setHasPreview(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
      setPreviewMessages([]);
    }
  }

  return (
    <div className="flex h-dvh flex-col bg-background">
      {/* Header */}
      <div className="flex h-14 shrink-0 items-center gap-3 border-b border-border/40 px-5">
        <a
          className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
          href="/"
        >
          ← Back
        </a>
        <span className="text-border/40">|</span>
        <span className="text-[13px] font-medium">Chat Preview</span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        {/* Input panel */}
        <div className="flex shrink-0 flex-col gap-3 border-b border-border/40 p-4 md:w-80 md:border-b-0 md:border-r">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            JSON Input
          </p>
          <textarea
            className="h-48 min-h-0 flex-1 resize-none rounded-lg border border-border/50 bg-muted/30 p-3 font-mono text-[12px] leading-relaxed text-foreground outline-none transition-colors focus:border-border md:h-auto md:flex-1"
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder={EXAMPLE_JSON}
            spellCheck={false}
            value={jsonInput}
          />
          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-600 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400">
              {error}
            </p>
          )}
          <button
            className="rounded-lg bg-primary px-4 py-2 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            onClick={handlePreview}
            type="button"
          >
            Preview
          </button>
          <div className="rounded-lg border border-border/30 bg-muted/20 p-3 text-[11px] leading-relaxed text-muted-foreground">
            <p className="mb-1.5 font-medium">Format</p>
            <p className="mb-2">
              Use <code className="font-mono">content</code> for plain text, or{" "}
              <code className="font-mono">parts</code> for rich content.
            </p>
            <p className="mb-1 font-medium">Tool parts</p>
            <p className="mb-2">
              Set <code className="font-mono">type</code> to{" "}
              <code className="font-mono">"tool-getWeather"</code> and{" "}
              <code className="font-mono">state</code> to{" "}
              <code className="font-mono">"output-available"</code>. Use{" "}
              <code className="font-mono">"output": null</code> to render with
              sample data.
            </p>
            <p className="font-medium">Supported tools</p>
            <ul className="mt-1 list-disc pl-3">
              <li>
                <code className="font-mono">tool-getWeather</code>
              </li>
              <li>
                <code className="font-mono">tool-createDocument</code>
              </li>
              <li>
                <code className="font-mono">tool-updateDocument</code>
              </li>
              <li>
                <code className="font-mono">tool-requestSuggestions</code>
              </li>
            </ul>
          </div>
        </div>

        {/* Preview panel */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
          {hasPreview ? (
            messages.length === 0 ? (
              <div className="flex flex-1 items-center justify-center text-[13px] text-muted-foreground">
                No messages to display
              </div>
            ) : (
              <DataStreamProvider>
                <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-4 py-6 md:gap-7">
                  {messages.map((msg) => (
                    <PreviewMessage
                      addToolApprovalResponse={noop as never}
                      chatId="preview"
                      isLoading={false}
                      isReadonly={true}
                      key={msg.id}
                      message={msg}
                      regenerate={noop as never}
                      requiresScrollPadding={false}
                      setMessages={noop as never}
                      vote={undefined}
                    />
                  ))}
                </div>
              </DataStreamProvider>
            )
          ) : (
            <div className="flex flex-1 items-center justify-center text-[13px] text-muted-foreground">
              Paste a JSON and click Preview
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
