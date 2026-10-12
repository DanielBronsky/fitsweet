import type { Payload } from "payload";
import { newInviteToken } from "../../cms/collections/Managers";

export async function ensureAdminInvites(payload: Payload) {
  const { docs } = await payload.find({ collection: "users", where: { inviteToken: { exists: false } }, depth: 0, limit: 0, pagination: false, overrideAccess: true });
  for (const user of docs) {
    await payload.update({ collection: "users", id: user.id, data: { inviteToken: newInviteToken("u_") }, context: { system: true }, overrideAccess: true });
  }
}
