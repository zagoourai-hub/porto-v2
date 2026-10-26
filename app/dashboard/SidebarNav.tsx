"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/libs/utils"
import { useMessages, useProjects } from "./lib/queries"
import { dim, mono, muted } from "./ui"

type Item = { label: string; href: string; hint?: "projects" | "messages" | "rag" }

const items: Item[] = [
    { label: "RINGKASAN", href: "/dashboard" },
    { label: "PROYEK", href: "/dashboard/proyek", hint: "projects" },
    { label: "PESAN MASUK", href: "/dashboard/pesan", hint: "messages" },
    { label: "CHAT AI", href: "/chat", hint: "rag" },
    { label: "MUSIK", href: "#" },
    { label: "PENGATURAN", href: "/dashboard/pengaturan" },
]

const SidebarNav = () => {
    const pathname = usePathname()
    const projects = useProjects().data?.length
    const unread = useMessages().data?.filter((m) => m.status === "new").length

    const hint = (h: Item["hint"]) => {
        if (h === "projects" && projects !== undefined) return <span className={`text-[10px] ${dim} font-mono`}>{String(projects).padStart(2, "0")}</span>
        if (h === "messages" && unread) return <span className={`badge badge-primary badge-sm size-4 p-0 text-[10px] font-bold ${mono}`}>{unread}</span>
        if (h === "rag") return <span className={`badge badge-secondary badge-soft badge-xs text-[9px] font-semibold ${mono}`}>RAG</span>
        return null
    }

    return (
        <nav className="flex flex-col" aria-label="Menu dashboard">
            {items.map((n) => {
                const active = n.href === "/dashboard" ? pathname === n.href : pathname.startsWith(n.href) && n.href !== "#"
                return (
                    <Link
                        key={n.label}
                        href={n.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                            "flex items-center justify-between px-6 py-2.5 text-xs font-medium transition-colors",
                            mono,
                            active ? "border-l-2 border-primary bg-base-200" : `${muted} hover:bg-base-200 hover:text-base-content`,
                        )}
                    >
                        <span className="flex items-center gap-2.5">
                            <span className={active ? "font-bold text-primary" : dim}>{active ? "#" : "/"}</span>
                            {n.label}
                        </span>
                        {active ? <span className="status status-primary"></span> : hint(n.hint)}
                    </Link>
                )
            })}
        </nav>
    )
}

export default SidebarNav
