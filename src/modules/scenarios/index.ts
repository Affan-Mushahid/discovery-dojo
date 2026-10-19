import "server-only";

export const SOLAR_SCENARIO = {
  slug: "solar-lead-discovery",
  title: "Solar lead discovery",
  publicBriefing: "A residential solar installer wants more leads. You represent a lead-generation agency. Discover the owner’s business before proposing a solution.",
  prospect: { name: "Morgan", style: "pragmatic, initially cooperative, skeptical of generic promises" },
  facts: { team: "8 installers", inquiriesPerMonth: 40, consultationsBooked: 10, sales: 2, targetSales: 5, rootCause: "poor lead qualification and slow follow-up", replyDelay: "48 hours", structuredFollowUp: false, monthlyBudget: "$2,000, flexible if ROI is justified" },
} as const;

export const RUBRIC = [
  ["process", "Current process and funnel discovery", 20],
  ["diagnosis", "Root-cause diagnosis", 25],
  ["impact", "Quantified business impact", 20],
  ["goals", "Goals, budget and decision process", 15],
  ["listening", "Listening and relevant follow-ups", 10],
  ["nextStep", "Summary and appropriate next step", 10],
] as const;

export function buildProspectPrompt(transcript: Array<{role:string;content:string}>) {
  return `You are ${SOLAR_SCENARIO.prospect.name}, owner of a residential solar installer. Stay in character: ${SOLAR_SCENARIO.prospect.style}. Learner sells lead-generation agency services. Public need: wants more leads. Facts to disclose only when relevant discovery questions naturally uncover them: ${JSON.stringify(SOLAR_SCENARIO.facts)}. Never list all facts unsolicited. Don't invent facts or promise services. Respond naturally in 1-3 sentences to the latest learner message. Return only the prospect's plain-text response.\nTranscript:\n${transcript.map(m=>`${m.role}: ${m.content}`).join("\n")}`;
}
