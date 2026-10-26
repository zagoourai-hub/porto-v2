import { requireAdmin } from "@/app/dashboard/lib/admin"
import { settingsSchema } from "@/app/dashboard/lib/schemas"
import { prisma } from "@/libs/prisma"

// The settings are a single row (id = 1). It is created the first time it is read.
const defaults = {
    displayName: "Web Developer",
    contactEmail: "hello@webdeveloper.dev",
    location: "Jakarta, Indonesia (GMT+7)",
    availability: "open",
    note: "Terbuka untuk freelance dan kontrak tertentu.",
}

// GET /api/dashboard/settings
export async function GET() {
    const denied = await requireAdmin()
    if (denied) return denied

    const settings = await prisma.siteSetting.upsert({
        where: { id: 1 },
        create: { id: 1, ...defaults },
        update: {},
    })
    return Response.json(settings)
}

// PUT /api/dashboard/settings
export async function PUT(request: Request) {
    const denied = await requireAdmin()
    if (denied) return denied

    const body = await request.json().catch(() => null)
    const parsed = settingsSchema.safeParse(body)
    if (!parsed.success) {
        return Response.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const settings = await prisma.siteSetting.upsert({
        where: { id: 1 },
        create: { id: 1, ...parsed.data },
        update: parsed.data,
    })
    return Response.json(settings)
}
