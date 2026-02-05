import bcrypt from "bcryptjs";
import { cookies, headers } from "next/headers";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/db";
const COOKIE_NAME = "alrakeen_session";
type SessionPayload = { sid: string; uid: string };
function getSecret() { const s = process.env.APP_SECRET || "DEV_SECRET_CHANGE_ME"; return s.length < 24 ? s.padEnd(24, "_") : s; }
function hmac(data: string) { const crypto = require("crypto") as typeof import("crypto"); return crypto.createHmac("sha256", getSecret()).update(data).digest("hex"); }
function pack(p: SessionPayload) { const raw = JSON.stringify(p); const sig = hmac(raw); return Buffer.from(raw,"utf8").toString("base64url")+"."+sig; }
function unpack(token: string): SessionPayload | null { const [b64,sig]=token.split("."); if(!b64||!sig) return null; const raw=Buffer.from(b64,"base64url").toString("utf8"); if(hmac(raw)!==sig) return null; try{return JSON.parse(raw);}catch{return null;} }
export async function signIn(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { ok: false as const, error: "المستخدم غير موجود" };
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return { ok: false as const, error: "كلمة المرور غير صحيحة" };
  const token = pack({ sid: nanoid(24), uid: user.id });
  cookies().set(COOKIE_NAME, token, { httpOnly: true, sameSite: "lax", path: "/" });
  return { ok: true as const };
}
export function signOut() { cookies().delete(COOKIE_NAME); }
export async function currentUser() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  const p = unpack(token);
  if (!p?.uid) return null;
  return prisma.user.findUnique({ where: { id: p.uid }, select: { id: true, name: true, email: true, role: true } });
}
export function getRequestIp() { const h=headers(); return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || ""; }
