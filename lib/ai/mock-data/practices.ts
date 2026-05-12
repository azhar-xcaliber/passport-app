export type PracticeConfig = {
  name: string;
  phone: string;
  // Future fields slot in here without touching the context/provider:
  // logo?: string;
  // primaryColor?: string;
  // address?: string;
  // hours?: string;
};

const PRACTICE_REGISTRY: Record<string, PracticeConfig> = {
  "acme-health.com": {
    name: "Acme Health Medical Center",
    phone: "(555) 800-ACME",
  },
  // Dev: acme-health.html served locally
  localhost: {
    name: "Acme Health Medical Center",
    phone: "(555) 800-ACME",
  },
};

export function getPracticeByOrigin(originUrl: string): PracticeConfig | null {
  // TODO: replace with real backend API call:
  // const res = await fetch(`${process.env.BACKEND_API_URL}/practices/by-origin`, {
  //   headers: { "x-embed-origin": originUrl },
  // });
  // if (!res.ok) return null;
  // return res.json();
  console.log("Looking up practice config for origin:", originUrl);
  try {
    const hostname = new URL(originUrl).hostname;
    return PRACTICE_REGISTRY[hostname] ?? null;
  } catch {
    return null;
  }
}
