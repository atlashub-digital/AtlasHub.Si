import { statusAvailability } from "../../../../../lib/sales/ll01-commerce";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(){
  return Response.json(await statusAvailability(),{headers:{"Cache-Control":"no-store"}});
}
