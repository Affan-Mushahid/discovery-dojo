import "server-only";
import { validateEvaluation } from "@/modules/evaluations";

export async function evaluateTranscript(prompt:string) {
  const key=process.env.OPENROUTER_API_KEY;
  if(!key) throw new Error("OpenRouter is not configured. Evaluation will be available when provider setup is complete.");
  const res=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${key}`,"Content-Type":"application/json"},body:JSON.stringify({model:"openrouter/free",messages:[{role:"user",content:prompt}],max_tokens:1200},),signal:AbortSignal.timeout(30000)});
  if(!res.ok) throw new Error("Evaluation provider unavailable; your transcript is safely saved.");
  const body=await res.json();
  const text=body?.choices?.[0]?.message?.content;
  if(typeof text!=="string") throw new Error("Evaluation response was invalid.");
  try { return validateEvaluation(JSON.parse(text.replace(/^```(?:json)?\s*|\s*```$/g,""))); } catch { throw new Error("Evaluation response could not be validated."); }
}
