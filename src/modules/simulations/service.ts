import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { verifiedSession } from "@/modules/auth/session";
import { buildProspectPrompt } from "@/modules/scenarios";
import { generateProspectReply, learnerMessageSchema, LEARNER_LIMIT } from "@/modules/conversations";
import { appendMessage, loadTranscript } from "@/modules/conversations/repository";
import { buildEvaluationPrompt } from "@/modules/evaluations";
import { evaluateTranscript } from "@/modules/evaluations/provider";

export async function startSimulation() {
  const {client,user}=await verifiedSession();
  const {data:scenario,error:scenarioError}=await client.from("scenarios").select("id,title,briefing,learner_message_limit").eq("slug","solar-lead-discovery").eq("published",true).single();
  if(scenarioError||!scenario) throw new Error("The shared solar scenario is not available yet. Approve the simulation database migration.");
  const {data,error}=await client.from("simulations").insert({user_id:user.id,scenario_id:scenario.id}).select("id").single();
  if(error||!data) throw new Error("Could not start simulation. Database setup may still be pending.");
  const opener="Hi, thanks for meeting. We’re a residential solar installer and could use more leads. What would you like to know?";
  await appendMessage(client,data.id,user.id,1,"prospect",opener);
  return data.id;
}

export async function sendTurn(simulationId:string,raw:string) {
  const parsed=learnerMessageSchema.safeParse(raw); if(!parsed.success) throw new Error("Message must be between 1 and 2,000 characters.");
  const {client,user}=await verifiedSession();
  const {data:sim,error}=await client.from("simulations").select("id,status,learner_message_count,scenario_id").eq("id",simulationId).eq("user_id",user.id).single();
  if(error||!sim) throw new Error("Simulation not found.");
  if(sim.status!=="active") throw new Error("This conversation has ended.");
  const transcript=await loadTranscript(client,simulationId,user.id);
  const nextCount=sim.learner_message_count+1;
  const learnerPosition=transcript.length+1;
  await appendMessage(client,simulationId,user.id,learnerPosition,"learner",parsed.data);
  let reply:string;
  if(nextCount>=LEARNER_LIMIT) reply="I’ve been answering questions, but we’ve gone around in circles and I’m not confident we’re getting closer to solving this. I think we should stop here.";
  else reply=await generateProspectReply(buildProspectPrompt([...transcript,{role:"learner",content:parsed.data}]));
  await appendMessage(client,simulationId,user.id,learnerPosition+1,"prospect",reply);
  const terminal=nextCount>=LEARNER_LIMIT;
  const update=await client.from("simulations").update({learner_message_count:nextCount,status:terminal?"failed":"active",finished_at:terminal?new Date().toISOString():null}).eq("id",simulationId).eq("status","active");
  if(update.error) throw new Error("Could not update the simulation state.");
  if(terminal) await saveEvaluation(client,simulationId,user.id,[...transcript,{role:"learner",content:parsed.data},{role:"prospect",content:reply}]);
  return {reply,ended:terminal,count:nextCount};
}

async function saveEvaluation(client:SupabaseClient,id:string,userId:string,transcript:Array<{role:string;content:string}>) {
  const result=await evaluateTranscript(buildEvaluationPrompt(transcript));
  const {error}=await client.from("evaluations").upsert({simulation_id:id,user_id:userId,score:result.score,breakdown:result.breakdown,evidence:result.evidence,missed_questions:result.missedQuestions,example_followups:result.exampleFollowups,tips:result.tips});
  if(error) throw new Error("Transcript saved but evaluation could not be saved.");
}
