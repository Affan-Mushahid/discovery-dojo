import { NextResponse } from "next/server";
import { verifiedSession, AccessError } from "@/modules/auth/session";
import { startSimulation } from "@/modules/simulations/service";
export const runtime="nodejs";
export async function POST(){try{await verifiedSession();const id=await startSimulation();return NextResponse.json({id});}catch(e){const status=e instanceof AccessError?e.status:500;return NextResponse.json({error:e instanceof Error?e.message:"Could not start."},{status});}}
