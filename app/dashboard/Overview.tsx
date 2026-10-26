"use client"
import Link from "next/link"
import { ApiError } from "./lib/api"
import { fmtDate, timeAgo } from "./lib/format"
import { useMessages, useProjects, useSettings } from "./lib/queries"
import { useRouter } from "next/navigation"
import { useSession } from "@/libs/auth-client"
import { useEffect } from "react"
import FlashDialog from "../components/alerts/flash-message"

// Everything on this page comes from the database (settings, projects and messages).
export default function Overview() {
    const router = useRouter();
    const settings = useSettings()
    const projects = useProjects()
    const messages = useMessages()
    const { data: session, isPending : sessionPending } = useSession();
    
    useEffect(() => {
        if (!sessionPending && !session?.user) {
            router.push("/auth");
        }
    }, [sessionPending, session, router]);




    if (settings.isPending || projects.isPending || messages.isPending || sessionPending) {
        return (
            <div className="flex justify-center p-20">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        )
    }

    if (settings.isError || projects.isError || messages.isError) {
        const error = settings.error || projects.error || messages.error
        const notLoggedIn = error instanceof ApiError && error.status === 401

        return (
            <div role="alert" className="alert alert-error flex-wrap justify-between text-xs">
                <span>{error?.message ?? "Terjadi kesalahan saat memuat data."}</span>
                {notLoggedIn && (
                    <Link href="/auth" className="btn btn-xs font-mono tracking-wider">
                        MASUK →
                    </Link>
                )}
            </div>
        )
    }

    const profile = settings.data
    const allProjects = projects.data
    const allMessages = messages.data

    const newMessages = allMessages.filter((m) => m.status === "new")
    const repliedMessages = allMessages.filter((m) => m.status === "replied")
    const latestMessage = allMessages[0]
    const liveProjects = allProjects.filter((p) => p.status === "live")
    const draftProjects = allProjects.filter((p) => p.status === "draft")
    const latestProject = allProjects[0]

    if (sessionPending) return <p className="text-center mt-8 text-white">Loading...</p>;
    if (!session?.user) return <p className="text-center mt-8 text-white">Redirecting...</p>;
    const { user } = session; 

    return (
        <>
            {/* greeting */}
            <div className="flex flex-col justify-between gap-4 border-b border-base-300 pb-6 md:flex-row md:items-end">
                <div>
                    <div>
                        <FlashDialog />
                    </div>
                    <div className="mb-2 font-mono text-[11px] uppercase tracking-wider text-base-content/60">
                        STATUS: {profile.availability === "open" ? "TERSEDIA UNTUK PROYEK" : "SEDANG PENUH"}
                    </div>
                    <h1 className="text-3xl font-extrabold leading-none tracking-[-0.04em]  md:text-4xl">
                        SELAMAT DATANG, <span className="text-primary uppercase font-extrabold italic"> {user.name}</span>
                        <p className="font-label font-bold text-sm p-1">Email : {user.email}</p>
                    </h1>
                </div>
                <div className="font-mono text-xs text-base-content/60 md:text-right">
                    LOKASI: <span className="font-bold text-base-content">{profile.location.toUpperCase()}</span>
                </div>
            </div>

            {/* 4 numbers */}
            <div className="stats stats-vertical w-full border border-base-300 bg-base-100 lg:stats-horizontal">
                <div className="stat px-5 py-5">
                    <div className="stat-title mb-1 font-mono text-[10px] uppercase tracking-wider text-base-content/60">
                        {"//"} 01 TOTAL PESAN
                    </div>
                    <div className="stat-value text-3xl font-extrabold tracking-[-0.03em]">{allMessages.length}</div>
                    <div className="stat-desc mt-1.5 font-mono text-[10px] text-base-content/40">
                        {repliedMessages.length} SUDAH DIBALAS
                    </div>
                </div>

                <div className="stat px-5 py-5">
                    <div className="stat-title mb-1 font-mono text-[10px] uppercase tracking-wider text-base-content/60">
                        {"//"} 02 PESAN BARU
                    </div>
                    <div className="stat-value flex items-baseline gap-2 text-3xl font-extrabold tracking-[-0.03em]">
                        <span className={newMessages.length > 0 ? "text-primary" : ""}>{newMessages.length}</span>
                        {newMessages.length > 0 && (
                            <span className="badge badge-primary badge-soft badge-xs font-mono font-bold">PERLU DIBALAS</span>
                        )}
                    </div>
                    <div className="stat-desc mt-1.5 font-mono text-[10px] text-base-content/40">
                        {latestMessage ? `TERAKHIR: ${timeAgo(latestMessage.receivedAt)}` : "BELUM ADA PESAN"}
                    </div>
                </div>

                <div className="stat px-5 py-5">
                    <div className="stat-title mb-1 font-mono text-[10px] uppercase tracking-wider text-base-content/60">
                        {"//"} 03 PROYEK TAYANG
                    </div>
                    <div className="stat-value flex items-baseline gap-2 text-3xl font-extrabold tracking-[-0.03em]">
                        <span>{String(liveProjects.length).padStart(2, "0")}</span>
                        {allProjects.length > 0 && (
                            <span className="badge badge-success badge-soft badge-xs font-mono font-bold">
                                {draftProjects.length === 0 ? "SEMUA AKTIF" : "ADA DRAF"}
                            </span>
                        )}
                    </div>
                    <div className="stat-desc mt-1.5 font-mono text-[10px] text-base-content/40">
                        {draftProjects.length} DRAF DALAM REVIEW
                    </div>
                </div>

                <div className="stat px-5 py-5">
                    <div className="stat-title mb-1 font-mono text-[10px] uppercase tracking-wider text-base-content/60">
                        {"//"} 04 TOTAL PROYEK
                    </div>
                    <div className="stat-value text-3xl font-extrabold tracking-[-0.03em]">
                        {String(allProjects.length).padStart(2, "0")}
                    </div>
                    <div className="stat-desc mt-1.5 font-mono text-[10px] text-base-content/40">
                        {latestProject ? `DIPERBARUI: ${fmtDate(latestProject.updatedAt)}` : "BELUM ADA PROYEK"}
                    </div>
                </div>
            </div>

            {/* latest messages + projects */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                <section className="border border-base-300 bg-base-100 lg:col-span-7">
                    <div className="flex items-center justify-between gap-3 border-b border-base-300 p-5">
                        <h3 className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider">
                            <span className="size-2 bg-primary"></span>
                            PESAN MASUK TERBARU
                        </h3>
                        <Link
                            href="/dashboard/pesan"
                            className="font-mono text-[11px] tracking-wider text-base-content/60 transition-colors hover:text-primary"
                        >
                            LIHAT SEMUA ({allMessages.length}) →
                        </Link>
                    </div>

                    {allMessages.length === 0 ? (
                        <p className="p-5 font-mono text-xs text-base-content/60">BELUM ADA PESAN MASUK.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr className="bg-base-200 font-mono text-[10px] uppercase tracking-wider text-base-content/60">
                                        <th>PENGIRIM</th>
                                        <th>SUBJEK</th>
                                        <th>WAKTU</th>
                                        <th className="text-right">STATUS</th>
                                    </tr>
                                </thead>
                                <tbody className="text-xs">
                                    {allMessages.slice(0, 4).map((m) => (
                                        <tr key={m.id} className="hover:bg-base-200">
                                            <td>
                                                <div className="font-semibold">{m.name}</div>
                                                <div className="font-mono text-[10px] text-base-content/60">{m.email}</div>
                                            </td>
                                            <td>{m.subject}</td>
                                            <td className="whitespace-nowrap font-mono text-[10px] text-base-content/60">
                                                {timeAgo(m.receivedAt)}
                                            </td>
                                            <td className="text-right">
                                                {m.status === "new" ? (
                                                    <span className="badge badge-primary badge-sm font-mono text-[9px] font-bold">BARU</span>
                                                ) : (
                                                    <span className="badge badge-sm bg-base-300 font-mono text-[9px] font-semibold">DIBALAS</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                <section className="border border-base-300 bg-base-100 lg:col-span-5">
                    <div className="flex items-center justify-between gap-3 border-b border-base-300 p-5">
                        <h3 className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider">
                            <span className="size-2 bg-base-content"></span>
                            PROYEK
                        </h3>
                        <span className="font-mono text-[10px] text-base-content/40">
                            {String(liveProjects.length).padStart(2, "0")} PUBLIKASI · {String(draftProjects.length).padStart(2, "0")} DRAF
                        </span>
                    </div>

                    {allProjects.length === 0 ? (
                        <p className="p-5 font-mono text-xs text-base-content/60">BELUM ADA PROYEK.</p>
                    ) : (
                        <div className="divide-y divide-base-300">
                            {allProjects.slice(0, 5).map((p, index) => (
                                <div key={p.id} className="flex items-center justify-between gap-3 p-3.5 transition-colors hover:bg-base-200">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-[10px] text-base-content/40">
                                                {String(index + 1).padStart(2, "0")}
                                            </span>
                                            <span className="truncate text-xs font-bold">{p.name}</span>
                                            {p.status === "live" ? (
                                                <span className="badge badge-success badge-soft badge-xs font-mono text-[9px] font-bold">TAYANG</span>
                                            ) : (
                                                <span className="badge badge-ghost badge-xs font-mono text-[9px] font-bold">DRAF</span>
                                            )}
                                        </div>
                                        <div className="mt-1 truncate pl-5 font-mono text-[10px] text-base-content/60">
                                            UPDATE: {fmtDate(p.updatedAt)} · {p.stack}
                                        </div>
                                    </div>
                                    <Link href="/dashboard/proyek" className="btn btn-outline btn-xs font-mono text-[10px]">
                                        EDIT
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </>
    )
}
