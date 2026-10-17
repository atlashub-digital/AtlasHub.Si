import { reserve } from "../../../../../lib/sales/ll01-commerce";
import { allowedOrigin } from "../../../../../lib/commerce/runtime";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(req: Request) {
  if(!allowedOrigin(req)) return Response.json({error:"origin"},{status:403});
  if(!req.headers.get("content-type")?.startsWith("application/json"))return Response.json({error:"content_type"},{status:415});
  const raw=await req.text(); if(raw.length>8000)return Response.json({error:"too_large"},{status:413});
  try{return await reserve(req,JSON.parse(raw));}catch{return Response.json({error:"unavailable"},{status:503});}
}
