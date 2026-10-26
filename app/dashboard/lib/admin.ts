import { headers } from "next/headers"
import { auth } from "@/libs/auth"
import { prisma } from "@/libs/prisma"

// Call this at the top of every /api/dashboard route.
// It returns an error Response when the caller may not use the dashboard, or null when they may.
export async function requireAdmin() {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
        return Response.json({ error: "Belum masuk. Silakan login dulu." }, { status: 401 })
    }

    // Allowed: the emails in DASHBOARD_ADMIN_EMAILS (comma separated).
    // If that is not set, only the oldest account is allowed. Sign-up is open on this site,
    // so "any logged-in user" would let every new visitor in.
    const adminEmails = (process.env.DASHBOARD_ADMIN_EMAILS ?? "")
        .split(",")
        .map((email) => email.trim().toLowerCase())
        .filter((email) => email !== "")

    let isAdmin = false
    if (adminEmails.length > 0) {
        isAdmin = adminEmails.includes(session.user.email.toLowerCase())
    } else {
        const oldestUser = await prisma.user.findFirst({ orderBy: { createdAt: "asc" } })
        isAdmin = oldestUser?.id === session.user.id
    }

    if (!isAdmin) {
        return Response.json({ error: "Akun ini tidak punya akses ke dashboard." }, { status: 403 })
    }
    return null
}
