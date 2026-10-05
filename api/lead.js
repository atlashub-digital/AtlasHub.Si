import { cases } from '../cases.js';
export function validateLead(body) {
 if (!body || typeof body !== 'object' || body.consent !== true || body.website) throw Error('Invalid request');
 const field=(name,max)=>{const value=body[name];if(value!==undefined&&typeof value!=='string')throw Error('Invalid field');if((value||'').length>max)throw Error('Too long');return (value||'').trim()};
 const name=field('name',100),company=field('company',160),email=field('email',160),phone=field('phone',30),intent=field('intent',20),requestId=field('requestId',50),preferredWindow=field('preferredWindow',160);
 if(!name||(!email&&!phone)|| (email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) || (phone&&!/^\+[\d ()-]{7,25}$/.test(phone)) || !['contact','meeting','quote'].includes(intent) || !/^[a-f0-9-]{36}$/i.test(requestId))throw Error('Invalid contact');
 if(intent==='meeting'&&!preferredWindow)throw Error('Missing preferred window');
 const d=body.diagnostic,c=cases.find(c=>c.id===d?.scenario);if(!c)throw Error('Invalid scenario');
 const options={channel:['email','whatsapp','system','manual'],systems:['api','sheets','docs','unknown'],frequency:['low','daily','high'],approach:['draft','bounded','explore']};
 const diagnostic={scenario:c.id,title:c.title};for(const [key,values] of Object.entries(options)){if(!values.includes(d[key]))throw Error('Invalid answer');diagnostic[key]=d[key]}
 return {requestId,name,company,email,phone,intent,preferredWindow,route:'human',consent:true,consentVersion:'clara-contact-v1',diagnostic};
}
export default async function handler(req,res) {
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({accepted:false})}
 const origin=process.env.PUBLIC_ORIGIN || 'https://atlashub.si';
 if(req.headers.origin!==origin)return res.status(403).json({accepted:false});
 if(!String(req.headers['content-type']||'').startsWith('application/json'))return res.status(415).json({accepted:false});
 let lead;try {let body=req.body;if(typeof body==='string'){if(body.length>12000)throw Error();body=JSON.parse(body)}if(JSON.stringify(body).length>12000)throw Error();lead=validateLead(body)}catch{return res.status(400).json({accepted:false})}
 const endpoint=process.env.LEAD_WEBHOOK_URL,token=process.env.LEAD_WEBHOOK_TOKEN;
 if(!endpoint?.startsWith('https://')||!token)return res.status(503).json({accepted:false});
 try {const response=await fetch(endpoint,{method:'POST',redirect:'error',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token,'Idempotency-Key':lead.requestId},body:JSON.stringify({...lead,receivedAt:new Date().toISOString(),source:'atlashub-clara'}),signal:AbortSignal.timeout(8000)});const result=await response.json();if(response.status!==202||typeof result.id!=='string'||!result.id||result.id.length>160||result.route!=='human')throw Error();return res.status(202).json({id:result.id,route:'human'})}catch{return res.status(502).json({accepted:false})}
}
