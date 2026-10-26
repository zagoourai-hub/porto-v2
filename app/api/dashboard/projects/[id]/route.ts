import { requireAdmin } from "@/app/dashboard/lib/admin"
import { projectInputSchema } from "@/app/dashboard/lib/schemas"
import { prisma } from "@/libs/prisma"

// PUT /api/dashboard/projects/:id -> update a project
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const denied = await requireAdmin()
    if (denied) return denied

    const { id } = await params
    const body = await request.json().catch(() => null)
    const parsed = projectInputSchema.safeParse(body)
    if (!parsed.success) {
        return Response.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const existing = await prisma.project.findUnique({ where: { id } })
    if (!existing) {
        return Response.json({ error: "Proyek tidak ditemukan" }, { status: 404 })
    }

    const project = await prisma.project.update({ where: { id }, data: parsed.data })
    return Response.json(project)
}

// DELETE /api/dashboard/projects/:id -> delete a project
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const denied = await requireAdmin()
    if (denied) return denied

    const { id } = await params
    const existing = await prisma.project.findUnique({ where: { id } })
    if (!existing) {
        return Response.json({ error: "Proyek tidak ditemukan" }, { status: 404 })
    }

    await prisma.project.delete({ where: { id } })
    return new Response(null, { status: 204 })
}
