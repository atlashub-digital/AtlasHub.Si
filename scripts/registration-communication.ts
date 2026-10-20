// Internal operator command; credentials come only from the server environment.
import postgres from "postgres";
import { getStore } from "../lib/commerce/store";
import { deliverRegistration } from "../lib/commerce/registration-communications";

const [id, action = "status"] = process.argv.slice(2);
if (!id || !/^[0-9a-f-]{36}$/i.test(id) || !["status", "retry", "book_sent", "live_access_sent"].includes(action)) {
  throw Error("Usage: npx tsx scripts/registration-communication.ts UUID status|retry|book_sent|live_access_sent");
}
if (!process.env.SI_DATABASE_URL) throw Error("SI_DATABASE_URL required");
const sql = postgres(process.env.SI_DATABASE_URL, { max: 1, prepare: false });
try {
  if (action === "retry") {
    const store = getStore()!;
    const reg = await store.get(id);
    if (!reg || reg.status !== "confirmed") throw Error("not_confirmed");
    await deliverRegistration(reg, store, process.env, fetch);
  } else if (action !== "status") {
    await sql`select si_workshops.communication_transition(${id}, ${action})`;
  }
  console.log(JSON.stringify(await sql`select * from si_workshops.registration_communications where registration_id=${id}`, null, 2));
} finally {
  await sql.end();
}
