"use client"
import { useState } from "react"
import { useLang } from "@/app/i18n/useLang"
import { Reveal, RevealGroup, RevealItem } from "@/app/components/animation/Reveal"
import { AdminkitMock, BooklyMock, LapakMock, NexusMock, PulseMock } from "./Mockups"

const filters = ["ALL", "WEB APP", "E-COMMERCE", "DASHBOARD", "LANDING"]

const projects = [
    {
        title: "LAPAK STORE", category: "E-COMMERCE", year: 2025, href: "#",
        desc: "High-performance headless marketplace with sub-second catalogue filtering and dynamic inventory sync.",
        tags: ["NEXT.JS 15", "TAILWIND", "STRIPE"], mock: <LapakMock />,
    },
    {
        title: "BOOKLY", category: "WEB APP", year: 2025, href: "#",
        desc: "Collaborative team calendar and client booking software with bi-directional Google & Outlook sync.",
        tags: ["TYPESCRIPT", "NODE.JS", "REDIS"], mock: <BooklyMock />,
    },
    {
        title: "ADMINKIT", category: "DASHBOARD", year: 2024, href: "#",
        desc: "Modular back-office control center featuring granular role permissions, instant schema audits, and bulk data export pipelines.",
        tags: ["REACT", "PRISMA", "SQLITE"], mock: <AdminkitMock />,
    },
    {
        title: "NEXUS ANALYTICS", category: "WEB APP", year: 2026, href: "#", demo: "#", wide: true,
        desc: "Full-stack infrastructure telemetry dashboard serving sub-50ms live query aggregations, automated cluster scaling alerts, and interactive event time-series visualizations.",
        tags: ["NEXT.JS", "TYPESCRIPT", "POSTGRES", "TAILWIND CSS"], mock: <NexusMock />,
    },
    {
        title: "PULSE LANDING", category: "LANDING", year: 2024, href: "#",
        desc: "Marketing engine for a developer tooling startup tuned for 100/100 Lighthouse performance, fluid micro-interactions, and high conversion.",
        tags: ["ASTRO", "TAILWIND", "FRAMER"], mock: <PulseMock />,
    },
]

const Work = () => {
    const { t } = useLang()
    const w = t.work
    const [filter, setFilter] = useState("ALL")
    const shown = projects.map((p, i) => ({ ...p, idx: i, no: String(i + 1).padStart(2, "0") })).filter((p) => filter === "ALL" || p.category === filter)

    return (
        <section id="work" className="w-full">
            <div className="container mx-auto p-5 sm:p-10">

                <Reveal className="border-t border-b border-base-300 py-3 flex items-center justify-between text-[8px] md:text-sm tracking-[0.14em] uppercase font-mono text-base-content/60 mb-16 lg:mb-20">
                    <div className="flex items-center gap-3">
                        <span className="status status-primary"></span>
                        <span className="font-semibold text-base-content">{w.eyebrow}</span>
                    </div>
                    <span>2024 — 2026 ({String(projects.length).padStart(2, "0")})</span>
                </Reveal>

                <Reveal delay={0.1}  className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10 pb-8 border-b border-base-300">
                    <h2 className="text-4xl md:text-5xl lg:text-[54px] leading-[1.05] font-bold tracking-[-0.04em] uppercase">
                        {w.h2a}<br />
                        <span className="text-primary">{w.h2b}</span>
                    </h2>

                    <div className="flex flex-col items-start lg:items-end gap-5 max-w-lg">
                        <p className="text-sm text-base-content/60 leading-relaxed lg:text-right">
                            {w.intro}
                        </p>
                        <div role="tablist" aria-label={w.filterLabel} className="flex flex-wrap items-center gap-1.5">
                            {filters.map((f) => (
                                <button
                                    key={f}
                                    role="tab"
                                    aria-selected={filter === f}
                                    onClick={() => setFilter(f)}
                                    className={`btn btn-sm font-mono text-[11px] tracking-wider ${filter === f ? "bg-base-content text-base-100 border-base-content" : "bg-base-100 text-base-content/60 hover:text-base-content hover:border-base-content/40"}`}
                                >
                                    {w.cats[f]}
                                </button>
                            ))}
                        </div>
                    </div>
                </Reveal>

                <RevealGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {shown.map((p) => (
                        <RevealItem blur={true} duration={7}  key={p.title} className={p.wide ? "md:col-span-2" : ""}>
                        <article
                            className={`group h-full flex flex-col justify-between border border-base-300 bg-base-100 transition-colors duration-150 hover:border-base-content/40`}
                        >
                            {p.mock}

                            <div className={`flex flex-col flex-1 justify-between ${p.wide ? "p-6" : "p-5"}`}>
                                <div>
                                    <div className="flex items-center justify-between font-mono text-xs text-base-content/60 mb-2 tracking-wider">
                                        {p.wide ? (
                                            <span className="flex items-center gap-2">
                                                <span className="font-bold text-base-content">{p.no}</span>
                                                <span>{"//"}</span>
                                                <span className="text-primary font-semibold">{w.featured}</span>
                                            </span>
                                        ) : (
                                            <span>{p.no}</span>
                                        )}
                                        <span>{w.cats[p.category]} · {p.year}</span>
                                    </div>

                                    <div className="flex items-center justify-between gap-3 mb-1.5 transition-transform duration-150 group-hover:translate-x-2">
                                        <h3 className={`font-bold tracking-tight ${p.wide ? "text-2xl lg:text-[26px]" : "text-[22px]"}`}>{p.title}</h3>
                                        <span className="flex items-center gap-4 shrink-0 font-mono text-xs font-medium">
                                            {p.demo && <a href={p.demo} className="link hidden sm:inline-block text-base-content/60 hover:text-base-content">{w.demo}</a>}
                                            <a href={p.href} className="link group-hover:text-primary transition-colors">{w.view}</a>
                                        </span>
                                    </div>

                                    <p className={`text-base-content/60 mb-4 ${p.wide ? "text-sm line-clamp-2 max-w-2xl" : "text-xs line-clamp-1"}`}>{w.descs[p.idx]}</p>
                                </div>

                                <div className="flex flex-wrap gap-1.5">
                                    {p.tags.map((t) => (
                                        <span key={t} className="badge bg-base-200 border-base-300 font-mono text-[10px]">{t}</span>
                                    ))}
                                </div>
                            </div>
                        </article>
                        </RevealItem>
                    ))}
                </RevealGroup>

                <Reveal>
                <footer className="footer sm:footer-horizontal items-center justify-between mt-20 pt-8 border-t border-base-300 font-mono text-xs tracking-wider">
                    <span className="text-base-content/60">{"//"} {String(projects.length).padStart(2, "0")} {w.shown}</span>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm font-mono tracking-wider uppercase">
                        {w.all}
                    </a>
                </footer>
                </Reveal>
            </div>
        </section>
    )
}

export default Work
