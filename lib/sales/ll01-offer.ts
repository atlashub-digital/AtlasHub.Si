/** Server-owned campaign. No default deadline: Helena must approve and configure it. */
export function ll01Offer(env: Record<string, string | undefined> = process.env, now = new Date()) {
  const raw = env.LL01_PROMO_ENDS_AT;
  const end = raw && /(?:Z|[+-]\d{2}:\d{2})$/.test(raw) ? new Date(raw) : null;
  const approved = env.LL01_CAMPAIGN_APPROVED === "yes" && !!end && Number.isFinite(end.getTime());
  const promotional = approved && env.LL01_PROMO_ENABLED === "yes" && now < end!;
  return { approved, promotional, code: promotional ? "ll01-promocional-br" : "ll01-regular-br",
    amount: promotional ? 24900 : 49700, deadline: approved ? end!.toISOString() : null,
    serverNow: now.toISOString() };
}
