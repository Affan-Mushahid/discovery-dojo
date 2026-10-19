import "server-only";
import { RUBRIC } from "@/modules/scenarios";

export function buildEvaluationPrompt(transcript: Array<{role:string;content:string}>) {
  return `Evaluate this sales discovery transcript using this 100-point rubric: ${JSON.stringify(RUBRIC)}. Use only evidenced learner statements/questions; never credit invented facts. Return valid JSON only, shape: {score:number,breakdown:{process:number,diagnosis:number,impact:number,goals:number,listening:number,nextStep:number},evidence:string[],missedQuestions:string[],exampleFollowups:string[],tips:string[]}. Each category max is respectively 20,25,20,15,10,10. Be specific and supportive. Transcript: ${JSON.stringify(transcript)}`;
}

export function validateEvaluation(value: unknown) {
  const shape = value as Record<string, unknown>;
  const breakdown = shape?.breakdown as Record<string, unknown>;
  const maxima = [20,25,20,15,10,10];
  const keys = ["process","diagnosis","impact","goals","listening","nextStep"];
  if (!Number.isInteger(shape?.score) || (shape.score as number)<0 || (shape.score as number)>100 || !breakdown) throw new Error("Invalid evaluation");
  const scores = keys.map((k,i) => breakdown[k]);
  if (scores.some((n,i)=>!Number.isInteger(n)||Number(n)<0||Number(n)>maxima[i])) throw new Error("Invalid evaluation breakdown");
  for (const key of ["evidence","missedQuestions","exampleFollowups","tips"]) if (!Array.isArray(shape[key]) || !(shape[key] as unknown[]).every(x=>typeof x==="string")) throw new Error("Invalid evaluation details");
  return shape as {score:number;breakdown:Record<string,number>;evidence:string[];missedQuestions:string[];exampleFollowups:string[];tips:string[]};
}
