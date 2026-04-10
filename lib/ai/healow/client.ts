const BASE = "https://healow.com/apps/HealowWebController";

export async function healowPost(
  action: string,
  body: Record<string, string>
): Promise<Record<string, unknown>> {
  const sessionId = process.env.HEALOW_SESSION_ID;
  const csrfToken = process.env.HEALOW_CSRF_TOKEN ?? "";

  console.log("Healow POST", { action, body });
  console.log("Healow credentials", {
    sessionId,
    csrfToken,
  });

  const res = await fetch(`${BASE}?action=${action}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      Cookie: `JSESSIONID=${sessionId}`,
      "X-CSRF-TOKEN": csrfToken,
    },
    body: new URLSearchParams(body).toString(),
  });

  if (!res.ok) {
    throw new Error(`Healow ${action} failed: ${res.status}`);
  }

  const data = await res.json();

  if (data.status !== "success") {
    throw new Error(`Healow ${action} returned non-success status`);
  }

  return data.response;
}
