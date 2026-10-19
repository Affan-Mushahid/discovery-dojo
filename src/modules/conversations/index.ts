import "server-only";
import { z } from "zod";

export const learnerMessageSchema = z.string().trim().min(1).max(2000);
export const LEARNER_LIMIT = 15;
export type TurnMessage = { role: "learner" | "prospect"; content: string };

export async function generateProspectReply(prompt: string): Promise<string> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("OpenRouter is not configured. Add OPENROUTER_API_KEY in Secrets.");
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "openrouter/free", messages: [{ role: "user", content: prompt }], max_tokens: 220 }),
    signal: AbortSignal.timeout(25000),
  });
  if (!response.ok) throw new Error(response.status === 429 ? "The free model pool is busy or rate-limited. Please retry shortly." : "The prospect provider is temporarily unavailable. Your message was not saved.");
  const data: unknown = await response.json();
  const parsed = z.object({ choices: z.array(z.object({ message: z.object({ content: z.string() }) })).min(1) }).safeParse(data);
  const reply = parsed.success ? parsed.data.choices[0]?.message.content.trim() : "";
  if (!reply || reply.length > 4000) throw new Error("The prospect returned an invalid response. Please retry.");
  return reply;
}
