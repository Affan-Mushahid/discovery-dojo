import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { profileSchema, type Profile } from "./validation";

export async function loadProfile(client: SupabaseClient, userId: string): Promise<Profile | null> {
  const { data, error } = await client.from("profiles").select("name,age,company").eq("user_id", userId).maybeSingle();
  if (error) throw new Error("Your profile could not be loaded. Check the database setup and try again.");
  return data ? profileSchema.parse(data) : null;
}
export async function saveProfile(client: SupabaseClient, userId: string, input: unknown) {
  const profile = profileSchema.parse(input);
  const { error } = await client.from("profiles").upsert({ user_id: userId, ...profile }, { onConflict: "user_id" });
  if (error) throw new Error("Your profile could not be saved. Please try again.");
  return profile;
}
