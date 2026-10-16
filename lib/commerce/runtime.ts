// Dependências reais do percurso de compra (servidor).
import { createHash } from "node:crypto";
import { aroConfig } from "../aro/client";
import { getStore } from "./store";
import type { Deps } from "./checkout";

export function runtimeDeps(): Deps {
  return { aro: aroConfig(), store: getStore(), env: process.env, fetch, now: () => new Date() };
}

export const secretCookie = (id: string) => `si_co_${id.replace(/-/g, "")}`;

/** IP anonimizado (com sal) só para o limite de tentativas. */
export function ipHash(req: Request): string | null {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const salt = process.env.WORKSHOP_IP_SALT;
  return ip && salt ? createHash("sha256").update(salt + ip).digest("hex").slice(0, 32) : null;
}

export function allowedOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  const allowed = (process.env.PUBLIC_ORIGIN || "https://www.atlashub.si,https://atlashub.si").split(",").map((s) => s.trim());
  return Boolean(origin && allowed.includes(origin));
}
