import type { Payload } from "payload";

export async function refreshOrderSearch(payload: Payload) {
  const { docs } = await payload.find({ collection: "orders", where: { search: { exists: false } }, depth: 0, limit: 0, pagination: false, overrideAccess: true });
  for (const order of docs) {
    await payload.update({ collection: "orders", id: order.id, data: {}, context: { fromBot: true }, overrideAccess: true });
  }
}
