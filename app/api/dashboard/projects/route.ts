import { requireAdmin } from "@/app/dashboard/lib/admin"
import { projectInputSchema } from "@/app/dashboard/lib/schemas"
import { prisma } from "@/libs/prisma"

// GET /api/dashboard/projects -> all projects, newest first
export async function GET() {
    const denied = await requireAdmin()
    if (denied) return denied

    const projects = await prisma.project.findMany({ 
        orderBy: { updatedAt: "desc" }

    })
    return Response.json(projects)
}

// POST /api/dashboard/projects -> create a project
export async function POST(request: Request) {
    const denied = await requireAdmin()
    if (denied) return denied

    const body = await request.json().catch(() => null)
    const parsed = projectInputSchema.safeParse(body)
    if (!parsed.success) {
        return Response.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const project = await prisma.project.create({ data: parsed.data })
    return Response.json(project, { status: 201 })
}
