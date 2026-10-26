import { requireAdmin } from "@/app/dashboard/lib/admin"
import { messagePatchSchema } from "@/app/dashboard/lib/schemas"
import { prisma } from "@/libs/prisma"

// PATCH /api/dashboard/messages/:id
// body { reply: "..." }  -> saves the reply and marks the message "replied"
// body { status: "..." } -> only changes the status
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const denied = await requireAdmin()
    if (denied) return denied

    const { id } = await params
    const body = await request.json().catch(() => null)
    const parsed = messagePatchSchema.safeParse(body)
    if (!parsed.success) {
        return Response.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const existing = await prisma.message.findUnique({ where: { id } })
    if (!existing) {
        return Response.json({ error: "Pesan tidak ditemukan" }, { status: 404 })
    }

    const data = "reply" in parsed.data ? { reply: parsed.data.reply, status: "replied" } : { status: parsed.data.status }
    const message = await prisma.message.update({ where: { id }, data })
    return Response.json(message)
}
