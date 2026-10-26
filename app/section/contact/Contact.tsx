"use client"
import type { SubmitEvent } from "react"
import { useLang } from "@/app/i18n/useLang"
import { Reveal } from "@/app/components/animation/Reveal"

const EMAIL = "hello@webdeveloper.dev"

const legend = "fieldset-legend font-mono text-xs tracking-[0.08em] uppercase text-base-content/60"
const field = "w-full rounded-none border-0 border-b border-base-300 px-0 text-base focus:border-primary focus:bg-transparent focus:outline-0"

// ponytail: no backend, submit opens the visitor's mail client. Swap for a server action / API route if form data must be stored.
const onSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const d = new FormData(e.currentTarget)
    const body = `${d.get("details")}\n\n— ${d.get("name")} (${d.get("email")})`
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(String(d.get("scope")))}&body=${encodeURIComponent(body)}`
}

const Contact = () => {
    const { t, lang } = useLang()
    const c = t.contact

    return (
        <section id="contact" className="w-full">
            <div className="container mx-auto p-5 sm:p-10">

                <Reveal className="border-t border-b border-base-300 py-3 flex items-center justify-between text-[8px] md:text-sm tracking-[0.14em] uppercase font-mono text-base-content/60 mb-16 lg:mb-20">
                    <div className="flex items-center gap-3">
                        <span className="status status-primary"></span>
                        <span className="font-semibold text-base-content">{c.eyebrow}</span>
                    </div>
                    <span>{c.reply}</span>
                </Reveal>

                <Reveal delay={0.1}>
                <h2 className="mb-16 lg:mb-20 max-w-5xl text-4xl min-[400px]:text-5xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-bold tracking-[-0.04em] leading-[1.03] uppercase">
                    {c.h2a}<span className="text-primary">{c.h2b}</span>
                </h2>
                </Reveal>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

                    {/* left: bio, email, info rows */}
                    <Reveal from="left" className="lg:col-span-5 flex flex-col gap-12 lg:min-h-96 lg:justify-between">
                        <div className="flex flex-col gap-8">
                            <p className="text-base sm:text-lg leading-relaxed text-base-content/60 max-w-md">{c.bio}</p>
                            <a href={`mailto:${EMAIL}`} className="group inline-flex items-center gap-3 self-start max-w-full font-mono text-sm min-[400px]:text-lg sm:text-2xl font-medium tracking-tight break-all hover:text-primary transition-colors duration-150">
                                <span className="link">{EMAIL.toUpperCase()}</span>
                                <span className="badge badge-primary size-6 p-0 text-xs transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
                            </a>
                        </div>

                        <dl className="border-t border-base-300">
                            {c.info.map((r, i) => (
                                <div key={i} className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between py-4 border-b border-base-300">
                                    <dt className="font-mono text-xs tracking-[0.08em] uppercase text-base-content/60">{r.label}</dt>
                                    <dd className="flex items-center gap-2 text-sm font-medium">
                                        {i === 1 && <span className="status status-primary"></span>}
                                        {r.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </Reveal>

                    {/* right: hairline form (key={lang} resets the select's default when the language changes) */}
                    <Reveal from="right" delay={0.15} className="lg:col-span-7">
                    <form key={lang} onSubmit={onSubmit} className="lg:pl-6 flex flex-col gap-8">
                        <fieldset className="fieldset">
                            <legend className={legend}>{c.legends[0]}</legend>
                            <input name="name" type="text" required placeholder={c.placeholders[0]} className={`input input-ghost ${field}`} />
                        </fieldset>

                        <fieldset className="fieldset">
                            <legend className={legend}>{c.legends[1]}</legend>
                            <input name="email" type="email" required placeholder={c.placeholders[1]} className={`input input-ghost ${field}`} />
                        </fieldset>

                        <fieldset className="fieldset">
                            <legend className={legend}>{c.legends[2]}</legend>
                            <select name="scope" defaultValue={c.scopes[0]} className={`select select-ghost ${field}`}>
                                {c.scopes.map((s) => <option key={s}>{s}</option>)}
                            </select>
                        </fieldset>

                        <fieldset className="fieldset">
                            <legend className={legend}>{c.legends[3]}</legend>
                            <textarea name="details" rows={4} required placeholder={c.placeholders[2]} className={`textarea textarea-ghost resize-none ${field}`} />
                        </fieldset>

                        <button type="submit" className="btn btn-primary self-start px-8 font-mono text-xs tracking-[0.1em] uppercase">
                            {c.send} <span className="text-sm">→</span>
                        </button>
                    </form>
                    </Reveal>
                </div>
            </div>
        </section>
    )
}

export default Contact
