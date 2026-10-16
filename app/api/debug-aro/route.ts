export const runtime = "nodejs";
export async function GET() {
  const apiUrl = process.env.ARO_API_URL;
  const cfg = {
    hasApiUrl: Boolean(apiUrl), apiUrl: apiUrl || null,
    hasProject: Boolean(process.env.ARO_PROJECT_SLUG),
    hasPublic: Boolean(process.env.ARO_PUBLIC_KEY),
    hasServer: Boolean(process.env.ARO_SERVER_KEY),
    payments: process.env.ARO_PAYMENTS_ENABLED,
  };
  let fetchResult = "skipped";
  if (apiUrl) {
    try {
      const res = await fetch(apiUrl + "/health", { signal: AbortSignal.timeout(8000), cache: "no-store" });
      fetchResult = `status=${res.status} body=${(await res.text()).slice(0, 80)}`;
    } catch (e) {
      fetchResult = `throw=${(e as Error).name}:${(e as Error).message}`.slice(0, 140);
    }
  }
  return Response.json({ cfg, fetchResult });
}
