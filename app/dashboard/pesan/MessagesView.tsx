"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { cn } from "@/libs/utils"
import { timeAgo } from "../lib/format"
import { useMessages, useReplyMessage, useSetMessageStatus } from "../lib/queries"
import type { Message, MessageStatus } from "../lib/types"
import { dim, fieldBase, FieldError, legend, mono, muted, Panel, QueryState } from "../ui"

type Filter = "all" | MessageStatus
const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "SEMUA" },
    { id: "new", label: "BARU" },
    { id: "replied", label: "DIBALAS" },
]

const StatusBadge = ({ status }: { status: MessageStatus }) =>
    status === "new"
        ? <span className={`badge badge-primary badge-sm text-[9px] font-bold ${mono}`}>BARU</span>
        : <span className={`badge badge-sm bg-base-300 text-[9px] font-semibold ${mono}`}>DIBALAS</span>

// ponytail: the "send" only stores the reply in the data layer. Sending a real email belongs in the backend
// (api.messages.reply), so this form needs no change when that exists.
const ReplyForm = ({ message }: { message: Message }) => {
    const reply = useReplyMessage()
    const setStatus = useSetMessageStatus()
    const { register, handleSubmit, formState: { errors } } = useForm<{ reply: string }>({ defaultValues: { reply: message.reply ?? "" } })

    return (
        <form onSubmit={handleSubmit(({ reply: text }) => reply.mutate({ id: message.id, reply: text }))} className="flex flex-col gap-5" noValidate>
            <fieldset className="fieldset">
                <legend className={legend}>BALASAN</legend>
                <textarea
                    {...register("reply", { required: "Tulis balasan dulu", minLength: { value: 10, message: "Minimal 10 karakter" } })}
                    rows={5}
                    placeholder={`Halo ${message.name.split(" ")[0]}, terima kasih sudah menghubungi…`}
                    aria-invalid={!!errors.reply}
                    className={`textarea textarea-ghost resize-none ${fieldBase}`}
                />
                <FieldError message={errors.reply?.message} />
            </fieldset>

            {reply.isError && <div role="alert" className="alert alert-error text-xs">{reply.error.message}</div>}
            {reply.isSuccess && <p className={`text-[11px] text-success ${mono}`}>BALASAN TERSIMPAN · PESAN DITANDAI DIBALAS</p>}

            <div className="flex flex-wrap items-center gap-3">
                <button type="submit" disabled={reply.isPending} className={`btn btn-primary btn-sm ${mono}`}>
                    {reply.isPending ? "MENGIRIM…" : "KIRIM BALASAN"}
                </button>
                <button
                    type="button"
                    disabled={setStatus.isPending}
                    onClick={() => setStatus.mutate({ id: message.id, status: message.status === "new" ? "replied" : "new" })}
                    className={`btn btn-outline btn-sm ${mono}`}
                >
                    TANDAI {message.status === "new" ? "DIBALAS" : "BARU"}
                </button>
            </div>
        </form>
    )
}

const MessagesView = () => {
    const messages = useMessages()
    const [filter, setFilter] = useState<Filter>("all")
    const [selectedId, setSelectedId] = useState<string | null>(null)

    const shown = messages.data?.filter((m) => filter === "all" || m.status === filter) ?? []
    const selected = shown.find((m) => m.id === selectedId) ?? shown[0] ?? null
    const unread = messages.data?.filter((m) => m.status === "new").length ?? 0

    return (
        <>
            <div className="flex flex-col justify-between gap-4 border-b border-base-300 pb-6 md:flex-row md:items-end">
                <div>
                    <div className={`mb-2 text-[11px] uppercase ${muted} ${mono}`}>{"//"} KOTAK MASUK</div>
                    <h1 className="text-3xl font-extrabold leading-none tracking-[-0.04em] md:text-4xl">PESAN MASUK<span className="text-primary">.</span></h1>
                </div>
                <div className={`text-xs ${muted} font-mono`}>{unread} PESAN PERLU DIBALAS</div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                <Panel
                    className="lg:col-span-5"
                    title="DAFTAR PESAN"
                    dot="primary"
                    aside={
                        <div role="tablist" aria-label="Filter pesan" className="flex gap-1">
                            {filters.map((f) => (
                                <button
                                    key={f.id}
                                    role="tab"
                                    aria-selected={filter === f.id}
                                    onClick={() => setFilter(f.id)}
                                    className={cn("btn btn-xs text-[10px]", mono, filter === f.id ? "bg-base-content text-base-100 border-base-content" : "bg-base-100")}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    }
                >
                    <QueryState q={messages} rows={4}>
                        <div className="divide-y divide-base-300">
                            {shown.length === 0 && <p className={`p-5 text-xs ${muted} font-mono`}>TIDAK ADA PESAN.</p>}
                            {shown.map((m) => (
                                <button
                                    key={m.id}
                                    onClick={() => setSelectedId(m.id)}
                                    aria-pressed={m.id === selected?.id}
                                    className={cn("flex w-full flex-col gap-1 p-4 text-left transition-colors hover:bg-base-200", m.id === selected?.id && "bg-base-200")}
                                >
                                    <span className="flex items-center justify-between gap-2">
                                        <span className={cn("truncate text-xs font-semibold", m.status === "replied" && muted)}>{m.name}</span>
                                        <StatusBadge status={m.status} />
                                    </span>
                                    <span className={cn("truncate text-xs", m.status === "replied" && muted)}>{m.subject}</span>
                                    <span className={`text-[10px] ${dim} font-mono`}>{timeAgo(m.receivedAt)}</span>
                                </button>
                            ))}
                        </div>
                    </QueryState>
                </Panel>

                <Panel className="self-start lg:col-span-7" title={selected ? "DETAIL PESAN" : "DETAIL"}>
                    {selected ? (
                        <div className="flex flex-col gap-6 p-5">
                            <div>
                                <div className="mb-1 flex items-center justify-between gap-3">
                                    <h2 className="text-lg font-bold leading-snug">{selected.subject}</h2>
                                    <StatusBadge status={selected.status} />
                                </div>
                                <div className={`text-[11px] ${muted} font-mono`}>
                                    {selected.name} · <a className="link" href={`mailto:${selected.email}`}>{selected.email}</a> · {timeAgo(selected.receivedAt)}
                                </div>
                            </div>
                            <p className="whitespace-pre-line border-l-2 border-base-300 pl-4 text-sm leading-relaxed">{selected.body}</p>
                            <ReplyForm key={selected.id} message={selected} />
                        </div>
                    ) : (
                        <p className={`p-5 text-xs ${muted} font-mono`}>PILIH PESAN DI DAFTAR UNTUK MELIHAT ISINYA.</p>
                    )}
                </Panel>
            </div>
        </>
    )
}

export default MessagesView
