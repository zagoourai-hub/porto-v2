"use client"
import { useEffect, useRef, useState, type ReactNode } from "react"
import Link from "next/link"
import { useMutation } from "@tanstack/react-query"
import { useForm, useWatch } from "react-hook-form"
import { useLang } from "@/app/i18n/useLang"
import { askAi, type ChatMessage } from "./api"

// one message in the conversation (a "user" question or an "assistant" answer)
type Msg = { role: "user" | "assistant"; text: string; failed?: boolean; vote?: 1 | -1 }
// an older conversation shown in the sidebar
type Chat = { title: string; at: string; msgs: Msg[] }

const mono = "font-mono tracking-wider"
const dim = "text-base-content/40"
const smallBtn = `btn btn-xs bg-base-200 text-[10px] uppercase ${mono}`
const hhmm = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

// turns our messages into what /api/chat expects, leaving out answers that failed
const toChat = (list: Msg[]) => {
    const result: ChatMessage[] = []
    for (const m of list) {
        if (m.failed || m.text === "") continue
        result.push({ role: m.role, content: m.text })
    }
    return result
}

const ChatApp = () => {
    const { t } = useLang()
    const c = t.chat
    const [msgs, setMsgs] = useState<Msg[]>([])
    const [history, setHistory] = useState<Chat[]>([])
    const scroller = useRef<HTMLDivElement>(null)

    // the text field (React Hook Form) and the request to the AI (React Query)
    const { register, handleSubmit, reset, control } = useForm<{ message: string }>({ defaultValues: { message: "" } })
    const typed = useWatch({ control, name: "message" }) // what is in the field right now
    const ask = useMutation({ mutationFn: askAi })
    const busy = ask.isPending

    // keep the newest message in view
    useEffect(() => {
        scroller.current?.scrollTo({ top: scroller.current.scrollHeight })
    }, [msgs])

    // changes the message at position `index`
    const changeMsg = (index: number, change: Partial<Msg>) =>
        setMsgs((list) => list.map((m, i) => (i === index ? { ...m, ...change } : m)))

    // sends the conversation to the API and writes the streamed answer into the message at `index`
    const askAnswer = (index: number, messages: ChatMessage[]) => {
        ask.mutate(
            { messages, onText: (text) => changeMsg(index, { text }) },
            { onError: () => changeMsg(index, { failed: true }) },
        )
    }

    const send = (text: string) => {
        const question = text.trim()
        if (!question || busy) return
        // the question and an empty answer are added, the answer fills up while it streams in
        setMsgs([...msgs, { role: "user", text: question }, { role: "assistant", text: "" }])
        askAnswer(msgs.length + 1, [...toChat(msgs), { role: "user", content: question }])
    }

    // the composer: send the typed text, then clear the field
    const onSubmit = handleSubmit(({ message }) => {
        send(message)
        reset()
    })

    // ask again for the answer at `index`, using only the messages before it
    const regenerate = (index: number) => {
        if (busy) return
        changeMsg(index, { text: "", failed: false, vote: undefined })
        askAnswer(index, toChat(msgs.slice(0, index)))
    }

    const vote = (index: number, value: 1 | -1) => changeMsg(index, { vote: msgs[index].vote === value ? undefined : value })

    const copy = (text: string) => navigator.clipboard?.writeText(text)

    // the current conversation moves to history, but only if the visitor asked something
    const currentToHistory = (): Chat[] => {
        const firstQuestion = msgs.find((m) => m.role === "user")
        return firstQuestion ? [{ title: firstQuestion.text, at: hhmm(), msgs }] : []
    }

    const newChat = () => {
        setHistory([...currentToHistory(), ...history])
        setMsgs([])
    }

    const openChat = (index: number) => {
        setHistory([...currentToHistory(), ...history.filter((_, i) => i !== index)])
        setMsgs(history[index].msgs)
    }

    return (
        <div className="fixed inset-0 z-60 flex flex-col overscroll-contain bg-base-100 text-base-content">

            {/* top bar */}
            <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-base-300 px-4 sm:px-6">
                <div className="flex min-w-0 items-center gap-3 text-xs">
                    <span className={`flex items-center gap-2.5 font-semibold ${mono}`}>
                        <span className="status status-primary"></span>
                        <span className="truncate">WEB DEVELOPER</span>
                    </span>
                    <span className={dim}>/</span>
                    <span className={`badge badge-sm bg-base-200 ${mono}`}>ASK-AI</span>
                </div>

                <div className="flex items-center gap-4 sm:gap-6">
                    <nav className={`flex items-center gap-4 sm:gap-5 text-xs text-base-content/60 ${mono}`}>
                        <Link href="/" className="hover:text-base-content transition-colors">{c.home}</Link>
                        <Link href="/#work" className="hover:text-base-content transition-colors">{c.work}</Link>
                        <Link href="/#contact" className="hover:text-base-content transition-colors">{c.contact}</Link>
                    </nav>
                    <span className={`badge hidden sm:inline-flex bg-base-200 text-[11px] ${mono}`}>
                        <span className="status status-primary"></span>{c.online}
                    </span>
                </div>
            </header>

            <div className="flex min-h-0 flex-1">

                {/* sidebar */}
                <aside className="hidden w-90 shrink-0 flex-col justify-between border-r border-base-300 lg:flex">
                    <div className="flex flex-1 flex-col overflow-y-auto">
                        <div className="border-b border-base-300 p-5">
                            <button onClick={newChat} disabled={busy} className={`btn btn-block justify-between bg-base-200 text-xs ${mono}`}>
                                <span className="flex items-center gap-2"><span className="font-semibold text-primary">+</span>{c.newChat}</span>
                            </button>
                        </div>

                        <div className="border-b border-base-300 p-5">
                            <div className={`mb-3 flex items-center justify-between text-[10px] uppercase ${dim} ${mono}`}>
                                <span>{"//"} {c.suggested}</span><span>{String(c.prompt.length).padStart(2, "0")} {c.prompts}</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                {c.prompt.map((s) => (
                                    <button key={s} onClick={() => send(s)} disabled={busy} className="btn btn-block h-auto justify-between bg-base-200 py-2.5 text-left text-xs font-normal text-base-content/60 hover:text-base-content">
                                        {s}<span className={`${mono} text-base-content/40`}>→</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 p-5">
                            <div className={`mb-3 flex items-center justify-between text-[10px] uppercase ${dim} ${mono}`}>
                                <span>{"//"} {c.history}</span><span>{c.session}</span>
                            </div>
                            {history.length === 0 && <p className={`text-[11px] ${dim} ${mono}`}>{c.noHistory}</p>}
                            <div className="flex flex-col gap-1">
                                {history.map((h, i) => (
                                    <button key={i} onClick={() => openChat(i)} disabled={busy} className="group p-2.5 text-left transition-colors hover:bg-base-200">
                                        <div className={`mb-1 text-[9px] ${dim} ${mono}`}>{c.today} · {h.at}</div>
                                        <p className="truncate text-xs text-base-content/60 group-hover:text-base-content">{h.title}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start gap-2 border-t border-base-300 p-4">
                        <span className={`text-[11px] leading-tight text-primary ${mono}`}>!</span>
                        <p className={`text-[10px] uppercase leading-relaxed tracking-tight ${dim} font-mono`}>{c.warn}</p>
                    </div>
                </aside>

                {/* conversation */}
                <main className="relative flex min-w-0 flex-1 flex-col">
                    <div ref={scroller} className="flex-1 overflow-y-auto px-4 py-6 sm:px-10 sm:py-8">
                        <div className="mx-auto flex max-w-190 flex-col gap-7 pb-40">

                            <div className="my-2 flex items-center justify-center">
                                <div className="h-px flex-1 bg-base-300"></div>
                                <span suppressHydrationWarning className={`px-4 text-[10px] uppercase ${dim} ${mono}`}>{c.today} — {hhmm()}</span>
                                <div className="h-px flex-1 bg-base-300"></div>
                            </div>

                            {/* first message, shown until the visitor asks something */}
                            {msgs.length === 0 && <AiBubble text={c.greeting} />}

                            {msgs.map((m, i) => {
                                if (m.role === "user") {
                                    return (
                                        <div key={i} className="flex w-full flex-col items-end">
                                            <span className={`mb-1.5 text-[10px] uppercase ${dim} ${mono}`}>{c.you}</span>
                                            <div className="max-w-135 border border-base-300 bg-base-200 p-4">
                                                <p className="text-[15px] leading-relaxed">{m.text}</p>
                                            </div>
                                        </div>
                                    )
                                }

                                // the newest answer is the one that can still be streaming or regenerated
                                const isLast = i === msgs.length - 1
                                const streaming = busy && isLast
                                return (
                                    <AiBubble key={i} text={m.failed ? c.failed : m.text} streaming={streaming}>
                                        {!streaming && (
                                            <div className="flex items-center gap-2 pt-2">
                                                {!m.failed && <button onClick={() => copy(m.text)} className={smallBtn}>{c.copy}</button>}
                                                {isLast && <button onClick={() => regenerate(i)} className={smallBtn}>{c.regenerate}</button>}
                                                {!m.failed && (
                                                    <button onClick={() => vote(i, 1)} aria-pressed={m.vote === 1} title={c.helpful} className={`${smallBtn} ${m.vote === 1 ? "text-primary" : ""}`}>▲</button>
                                                )}
                                                {!m.failed && (
                                                    <button onClick={() => vote(i, -1)} aria-pressed={m.vote === -1} title={c.notHelpful} className={`${smallBtn} ${m.vote === -1 ? "text-primary" : ""}`}>▼</button>
                                                )}
                                            </div>
                                        )}
                                    </AiBubble>
                                )
                            })}

                            {/* mobile: suggestions live here because the sidebar is hidden */}
                            {msgs.length === 0 && (
                                <div className="flex flex-wrap gap-2 lg:hidden">
                                    {c.prompt.map((s) => (
                                        <button key={s} onClick={() => send(s)} className="btn btn-sm h-auto bg-base-200 py-2 text-left text-xs font-normal">{s}</button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* composer */}
                    <div className="absolute inset-x-0 bottom-0 border-t border-base-300 bg-base-100/95 px-4 py-4 backdrop-blur-md sm:px-10">
                        <form onSubmit={onSubmit} className="mx-auto max-w-190">
                            <div className="flex items-center border border-base-300 bg-base-200 transition-colors focus-within:border-primary">
                                <span className={`pl-4 pr-2 text-xs font-semibold text-primary ${mono}`}>/</span>
                                <input
                                    {...register("message")}
                                    placeholder={c.placeholder}
                                    aria-label={c.message}
                                    autoComplete="off"
                                    autoFocus
                                    className={`min-w-0 flex-1 bg-transparent py-3.5 text-xs uppercase placeholder:text-base-content/40 focus:outline-none ${mono}`}
                                />
                                <button type="submit" disabled={busy || !typed.trim()} aria-label={c.send} className="btn btn-primary btn-square h-11 w-11 shrink-0">→</button>
                            </div>
                            <div className={`mt-2 flex items-center justify-between px-1 text-[10px] ${dim} ${mono}`}>
                                <span>{c.enter}</span>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    )
}

// an AI message: header, the text, and whatever is passed as children (the buttons under the text)
const AiBubble = ({ text, streaming = false, children }: { text: string; streaming?: boolean; children?: ReactNode }) => {
    const { t } = useLang()
    const c = t.chat

    return (
        <div className="flex w-full flex-col items-start">
            <div className="mb-2 flex items-center gap-2">
                <span className="status status-primary"></span>
                <span className={`text-[11px] font-medium uppercase ${mono}`}>WEB DEVELOPER AI</span>
                {streaming
                    ? <span className={`animate-pulse border border-primary/40 px-1.5 text-[9px] uppercase text-primary ${mono}`}>{c.generating}</span>
                    : <span className={`text-[10px] ${dim} font-mono`}>· BOT</span>}
            </div>

            <div className={`flex max-w-180 flex-col gap-3.5 border-l pl-4 ${streaming ? "border-primary/30" : "border-base-300"}`}>
                <p className="text-[15px] leading-relaxed">
                    {text}
                    {streaming && <span className="ml-1 animate-pulse font-mono font-bold text-primary">█</span>}
                </p>
                {children}
            </div>
        </div>
    )
}

export default ChatApp
