import { requireAdmin } from "@/app/dashboard/lib/admin"
import { prisma } from "@/libs/prisma"

// GET /api/dashboard/messages -> all messages, newest first
export async function GET() {
    const denied = await requireAdmin()
    if (denied) return denied

    const messages = await prisma.message.findMany({ orderBy: { receivedAt: "desc" } })
    return Response.json(messages)
}
