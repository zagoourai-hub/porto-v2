import Link from "next/link"
import type { ReactNode } from "react"
import { ApiError } from "./lib/api"
import { cn } from "@/libs/utils"

export const mono = "font-mono tracking-wider"
export const dim = "text-base-content/40"
export const muted = "text-base-content/60"

export const Panel = ({ title, dot, aside, children, footer, className }: {
    title: string
    dot?: "primary"
    aside?: ReactNode
    children: ReactNode
    footer?: ReactNode
    className?: string
}) => (
    <section className={cn("flex flex-col justify-between border border-base-300 bg-base-100", className)}>
        <div>
            <div className="flex items-center justify-between gap-3 border-b border-base-300 p-5">
                <h3 className={`flex items-center gap-2 text-xs font-bold uppercase ${mono}`}>
                    <span className={cn("size-2", dot === "primary" ? "bg-primary" : "bg-base-content")}></span>
                    {title}
                </h3>
                {aside}
            </div>
            {children}
        </div>
        {footer}
    </section>
)

type QueryLike = { isPending: boolean; isError: boolean; error: unknown; refetch: () => unknown }

// loading skeleton / error with retry / children once data is there
export const QueryState = ({ q, rows = 3, children }: { q: QueryLike; rows?: number; children: ReactNode }) => {
    if (q.isPending) {
        return (
            <div className="flex flex-col gap-3 p-5" aria-busy="true" aria-label="Memuat">
                {Array.from({ length: rows }, (_, i) => <div key={i} className="skeleton h-10 w-full" />)}
            </div>
        )
    }
    if (q.isError) {
        return (
            <div role="alert" className="alert alert-error m-5 flex-wrap justify-between text-xs">
                <span>{q.error instanceof Error ? q.error.message : "Terjadi kesalahan saat memuat data."}</span>
                {q.error instanceof ApiError && q.error.status === 401
                    ? <Link href="/auth" className={`btn btn-xs ${mono}`}>MASUK →</Link>
                    : <button onClick={() => q.refetch()} className={`btn btn-xs ${mono}`}>COBA LAGI</button>}
            </div>
        )
    }
    return <>{children}</>
}

export const legend = `fieldset-legend text-xs uppercase ${muted} ${mono}`
export const fieldBase = "w-full rounded-none border-0 border-b border-base-300 px-0 text-sm focus:border-primary focus:bg-transparent focus:outline-0"

export const FieldError = ({ message }: { message?: string }) =>
    message ? <p role="alert" className={`mt-1 text-[11px] text-error ${mono} not-italic`}>{message}</p> : null
