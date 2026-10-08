#!/usr/bin/env node
// Validate the 8 visual pack contracts; does not assert image binaries or a deployed site.
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const root=join(dirname(fileURLToPath(import.meta.url)),"..");
const load=(p)=>JSON.parse(readFileSync(join(root,p),"utf8"));
const manifest=load("manifest.json"),tokens=load("tokens.json");
let ok=0;
const required=["version","locale","id","name","surface","route","asset","headline","layout","sections","interactions","responsive","acceptance","brand","implementation","guardrails"];
if(manifest.screens.length!==8)throw new Error("Exactly 8 approved screens required");
if(!tokens.foundations?.palette?.cyan || !tokens.logoPolicy?.mustBeExact)throw new Error("Missing brand foundations");
for(const s of manifest.screens){
 const d=load(s.spec);
 const missing=required.filter(k=>d[k]===undefined);
 if(missing.length)throw new Error(s.id+": missing "+missing.join(", "));
 if(!Array.isArray(d.sections) || d.sections.length<5)throw new Error(s.id+": at least 5 sections required");
 if(!Array.isArray(d.acceptance) || d.acceptance.length<3)throw new Error(s.id+": acceptance criteria required");
 if(!d.guardrails?.allDataInMockupIsFictional || !d.brand?.logo?.mustUseOriginal)throw new Error(s.id+": guards missing");
 if(s.image!==`assets/screens/${d.asset}`)throw new Error(s.id+": asset manifest mismatch");
 if(s.route!==d.route)throw new Error(s.id+": route mismatch");
 ok++; console.log("PASS",s.id,d.name,d.sections.length+" sections");
}
const assets=load("asset-inventory.json");
if(assets.images.length!==8)throw new Error("Asset inventory incomplete");
console.log(`PASS ${ok}/8 JSON specs + manifest + tokens + asset inventory`);
const missing=assets.images.map(x=>"assets/screens/"+x.name).filter(p=>!existsSync(join(root,p)));
if(missing.length)console.warn("PENDING ART IMPORT:",missing.length,"screenshots are in the separately delivered ZIP and must be committed by Claude Code.");
