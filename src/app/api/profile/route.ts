import { verifiedSession } from "@/modules/auth/session";
import { saveProfile } from "@/modules/profiles/repository";
import { apiError, assertSameOrigin, json, readBody } from "@/lib/http";

export async function PUT(request: Request) {
  try {
    assertSameOrigin(request);
    const { client, user } = await verifiedSession();
    const profile = await saveProfile(client, user.id, await readBody(request));
    return json({ message: "Profile saved. You’re all set.", profile });
  } catch (error) { return apiError(error); }
}
