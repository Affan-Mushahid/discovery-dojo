import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function loadTranscript(db: SupabaseClient, simulationId: string, userId: string) {
  const {data,error}=await db.from("conversation_messages").select("position,role,content").eq("simulation_id",simulationId).eq("user_id",userId).order("position");
  if(error) throw new Error("Could not load conversation history.");
  return data ?? [];
}
export async function appendMessage(db: SupabaseClient, simulationId:string,userId:string,position:number,role:"learner"|"prospect",content:string) {
  const {error}=await db.from("conversation_messages").insert({simulation_id:simulationId,user_id:userId,position,role,content});
  if(error) throw new Error("Could not save the conversation. Retry your message.");
}
