
import type { Metadata } from "next"
import Link from "next/link"
import type { ReactNode } from "react"
import Crumb from "./Crumb"
import Providers from "./Providers"
import SidebarNav from "./SidebarNav"
import { dim, mono, muted } from "./ui"
import Button from "../components/ui/button"

export const metadata: Metadata = { title: { default: "Dashboard", template: "%s · Dashboard" }, robots: { index: false, follow: false } }

// Shell shared by every /dashboard page. It covers the public navbar/footer (same trick as /chat).
export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <Providers>
            <div className="fixed inset-0 z-60 overscroll-contain bg-base-100 text-base-content [&_p]:not-italic! [&_span]:not-italic!">
                <div className="drawer h-full lg:drawer-open">
                    <input id="dash-drawer" type="checkbox" className="drawer-toggle" />

                    {/* main column scrolls on its own, the sidebar stays put */}
                    <div className="drawer-content flex h-full min-w-0 flex-col overflow-y-auto">
                        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-base-300 bg-base-100 px-4 sm:px-8">
                            <div className="flex min-w-0 items-center gap-3">
                                <label htmlFor="dash-drawer" aria-label="Buka menu" className="btn btn-ghost btn-sm btn-square text-base lg:hidden">☰</label>
                                <Crumb />
                            </div>
                            <div className="flex items-center gap-3">
                                <Link href="/" className={`btn btn-outline btn-sm hidden text-xs sm:inline-flex ${mono}`}>LIHAT SITUS <span className={muted}>↗</span></Link>
                                <Link href="/dashboard/proyek" className={`btn btn-primary btn-sm text-xs font-bold ${mono}`}>+ PROYEK BARU</Link>
                            </div>
                        </header>

                        <main className="mx-auto flex w-full max-w-300 flex-col gap-8 p-4 sm:p-8">
                            {children}

                            <footer className={`flex flex-col items-center justify-between gap-2 border-t border-base-300 pb-2 pt-6 text-[10px] ${dim} font-mono sm:flex-row`}>
                                <div className="flex flex-wrap items-center gap-3">
                                    <span>WEB DEVELOPER // SISTEM MANAJEMEN PORTOFOLIO</span>
                                    <span>·</span>
                                    <span>TERENKRIPSI END-TO-END</span>
                                </div>
                                <div>© 2026 WEB DEVELOPER · DIBUAT DENGAN PRESISI BRUTALIST-LITE</div>
                            </footer>
                        </main>
                    </div>

                    {/* sidebar: always visible on lg, a drawer below that */}
                    <div className="drawer-side z-30">
                        <label htmlFor="dash-drawer" aria-label="Tutup menu" className="drawer-overlay"></label>
                        <aside className="flex min-h-full w-60 flex-col justify-between border-r border-base-300 bg-base-100">
                            <div>
                                <div className="flex h-16 items-center gap-2.5 border-b border-base-300 px-6">
                                    <span className="status status-primary"></span>
                                    <span className={`text-xs font-bold tracking-[0.14em] ${mono}`}>WEB DEVELOPER</span>
                                </div>

                                <div className="pb-2 pt-6">
                                    <div className="mb-2 px-6">
                                        <span className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${dim} font-mono`}>MENU</span>
                                    </div>
                                    <SidebarNav />
                                </div>
                            </div>

                            <div className="border-t border-base-300 p-4">
                                <div className="mb-2 flex items-center justify-between border border-base-300 bg-base-200 p-3">
                                    <div className="flex items-center gap-2.5">
                                        <div className={`flex size-7 items-center justify-center bg-base-content text-xs font-bold text-base-100 ${mono}`}>WD</div>
                                        <div>
                                            <div className="text-xs font-semibold leading-none">Web Developer</div>
                                            <div className={`mt-1 text-[10px] leading-none ${muted} ${mono}`}>ADMINISTRATOR</div>
                                        </div>
                                    </div>
                                    <span className="status status-primary" title="Admin Level 1"></span>
                                </div>
                             <Button />
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </Providers>
    )
}
