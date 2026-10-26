export type ProjectStatus = "live" | "draft"

export type Project = {
    id: string
    name: string
    stack: string
    status: ProjectStatus
    updatedAt: string // ISO
}
export type ProjectInput = Pick<Project, "name" | "stack" | "status">

export type MessageStatus = "new" | "replied"

export type Message = {
    id: string
    name: string
    email: string
    subject: string
    body: string
    receivedAt: string // ISO
    status: MessageStatus
    reply?: string | null
}

export type Settings = {
    displayName: string
    contactEmail: string
    location: string
    availability: "open" | "busy"
    note: string
}
