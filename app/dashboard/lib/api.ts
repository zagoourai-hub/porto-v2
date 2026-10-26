// Client-side data layer for the dashboard: the functions React Query calls (see ./queries.ts).
// Everything uses plain fetch to the /api/dashboard/* routes, which read and write SQLite with Prisma.
import type { Message, MessageStatus, Project, ProjectInput, Settings } from "./types"

export class ApiError extends Error {
    status: number

    constructor(message: string, status: number) {
        super(message)
        this.status = status
    }
}

// throws when the server answered with an error, using the message the API sent
async function assertOk(res: Response) {
    if (res.ok) return
    const data = await res.json().catch(() => null)
    throw new ApiError(data?.error ?? `Permintaan gagal (${res.status})`, res.status)
}

const jsonHeaders = { "Content-Type": "application/json" }

export const api = {
    projects: {
        list: async (): Promise<Project[]> => {
            const res = await fetch("/api/dashboard/projects", { cache: "no-store" })
            await assertOk(res)
            return res.json()
        },
        create: async (input: ProjectInput): Promise<Project> => {
            const res = await fetch("/api/dashboard/projects", {
                method: "POST",
                headers: jsonHeaders,
                body: JSON.stringify(input),
            })
            await assertOk(res)
            return res.json()
        },
        update: async ({ id, ...input }: ProjectInput & { id: string }): Promise<Project> => {
            const res = await fetch(`/api/dashboard/projects/${id}`, {
                method: "PUT",
                headers: jsonHeaders,
                body: JSON.stringify(input),
            })
            await assertOk(res)
            return res.json()
        },
        remove: async (id: string): Promise<void> => {
            const res = await fetch(`/api/dashboard/projects/${id}`, { method: "DELETE" })
            await assertOk(res)
        },
    },

    messages: {
        list: async (): Promise<Message[]> => {
            const res = await fetch("/api/dashboard/messages", { cache: "no-store" })
            await assertOk(res)
            return res.json()
        },
        reply: async ({ id, reply }: { id: string; reply: string }): Promise<Message> => {
            const res = await fetch(`/api/dashboard/messages/${id}`, {
                method: "PATCH",
                headers: jsonHeaders,
                body: JSON.stringify({ reply }),
            })
            await assertOk(res)
            return res.json()
        },
        setStatus: async ({ id, status }: { id: string; status: MessageStatus }): Promise<Message> => {
            const res = await fetch(`/api/dashboard/messages/${id}`, {
                method: "PATCH",
                headers: jsonHeaders,
                body: JSON.stringify({ status }),
            })
            await assertOk(res)
            return res.json()
        },
    },

    settings: {
        get: async (): Promise<Settings> => {
            const res = await fetch("/api/dashboard/settings", { cache: "no-store" })
            await assertOk(res)
            return res.json()
        },
        update: async (input: Settings): Promise<Settings> => {
            const res = await fetch("/api/dashboard/settings", {
                method: "PUT",
                headers: jsonHeaders,
                body: JSON.stringify(input),
            })
            await assertOk(res)
            return res.json()
        },
    },
}
