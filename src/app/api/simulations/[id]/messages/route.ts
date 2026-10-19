import { NextResponse } from "next/server";
import { AccessError } from "@/modules/auth/session";
import { sendTurn } from "@/modules/simulations/service";
export const runtime="nodejs";
export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){try{const {id}=await params;const body=await req.json();if(typeof body.message!=="string")return NextResponse.json({error:"Message required."},{status:400});return NextResponse.json(await sendTurn(id,body.message));}catch(e){const status=e instanceof AccessError?e.status:e instanceof Error&&e.message.includes("between 1")?400:500;return NextResponse.json({error:e instanceof Error?e.message:"Could not send message."},{status});}}
