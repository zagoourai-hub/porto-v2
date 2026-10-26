"use client"
import { useLang } from "@/app/i18n/useLang"
import { Reveal, RevealGlow, RevealGroup, RevealItem } from "@/app/components/animation/Reveal"

const entries = [
    {
        period: '2026 — NOW',
        meta: 'REMOTE · FULL-TIME EQUIVALENT',
        role: 'Freelance Web Developer',
        desc: 'Shipping production-grade, end-to-end web applications and high-conversion client platforms with rigorous responsiveness, sub-100ms interactions, and clean API orchestration.',
        tags: ['NEXT.JS', 'TYPESCRIPT', 'POSTGRES'],
        current: true,
    },
    {
        period: '2024 — 2026',
        meta: 'STARTUP · JAKARTA',
        role: 'Frontend Developer',
        desc: 'Engineered unified modular component design systems and refactored core customer checkout funnels, cutting overall initial bundle size and reducing page load times by 60%.',
        tags: ['REACT', 'TAILWIND', 'STORYBOOK'],
    },
    {
        period: '2022 — 2024',
        meta: 'AGENCY · JAKARTA',
        role: 'Junior Web Developer',
        desc: 'Delivered 15+ bespoke commercial client websites from Figma specifications, collaborating directly with creative directors, optimizing SEO metrics, and managing CMS integrations.',
        tags: ['HTML', 'CSS', 'JAVASCRIPT', 'WORDPRESS'],
    },
    {
        period: '2021 — 2022',
        meta: 'ONLINE',
        role: 'Self-taught — Bootcamp',
        desc: 'Mastered computer science basics, semantic markup, reactive UI patterns, and version control discipline while deploying early open-source projects and developer tools.',
        tags: ['JAVASCRIPT', 'GIT'],
    },
]

const Timeline = () => {
    const { t } = useLang()
    const tl = t.timeline
    const items = entries.map((e, i) => ({ ...e, ...tl.items[i] }))
    return (
        <section id="timeline" className="w-full">
            <div className="container mx-auto p-5 sm:p-10">

                <Reveal className="border-t border-b border-base-300 py-3 flex items-center justify-between text-[8px] md:text-sm tracking-[0.14em] uppercase font-mono text-base-content/60 mb-16 lg:mb-20">
                    <div className="flex items-center gap-3">
                        <span className="status status-primary"></span>
                        <span className="font-semibold text-base-content">{tl.eyebrow}</span>
                    </div>
                    <span>2022 — 2026</span>
                </Reveal>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

                    {/* left: sticky header */}
                    <Reveal from="left" className="lg:col-span-4 lg:sticky lg:top-12 flex flex-col">
                        <h2 className="sm:text-5xl block lg:text-[44px] xl:text-5xl leading-[1.05] font-extrabold tracking-[-0.04em] uppercase">
                            {tl.h2a}{' '}
                            <span className="text-primary">{tl.h2b}</span><br />
                            {tl.h2c}
                        </h2>

                        <p className="mt-8 text-[15px] leading-[1.65] text-base-content/60 max-w-85">
                            {tl.intro}
                        </p>

                        <div className="mt-10 pt-6 border-t border-base-300 flex flex-col gap-3 font-mono text-[11px] tracking-[0.08em] uppercase text-base-content/60">
                            <div className="flex items-center gap-2">
                                <span className="text-primary font-bold">{"//"}</span>
                                <span className="text-base-content">{String(entries.length).padStart(2, '0')} {tl.entries}</span>
                                <span className="text-base-content/20">/</span>
                                <span>{tl.currentYear}</span>
                            </div>
                            <div className="text-[10px] text-base-content/40 tracking-[0.06em]">
                                {tl.status}
                            </div>
                        </div>

                        <a href="#download" className="btn btn-outline mt-12 self-start justify-between gap-6 font-mono tracking-[0.08em] uppercase">
                            <span>{tl.cv}</span>
                            <span className="text-primary">↓</span>
                        </a>
                    </Reveal>

                    {/* right: daisyUI timeline */}
                    {/* entries play one by one: dot lights up red, then its card slides in with motion blur */}
                    <RevealGroup stagger={0.1} duration={400} viewport={{once: false}} className="lg:col-span-8">
                    <ul className="timeline timeline-vertical timeline-compact timeline-snap-icon">
                        {items.map((e, i) => (
                            <li key={e.role} className="grid-cols-[0_auto_minmax(0,1fr)]!">
                                {i > 0 && <hr />}
                                <div className="timeline-middle mt-5">
                                    <span className="relative inline-flex">
                                        <span className={`status status-md ${e.current ? 'status-primary' : ''}`}></span>
                                        <RevealGlow className="absolute inset-0 bg-primary shadow-[0_0_12px_2px_var(--color-primary)]" />
                                    </span>
                                </div>
                                <div className="timeline-end w-full! m-0! px-4 sm:px-8 py-9 border-b border-base-300 hover:bg-base-200 transition-colors duration-200">
                                    <RevealItem from="right" duration={4} blur className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-3 font-mono text-xs tracking-[0.08em] uppercase mb-2">
                                                <span className={e.current ? 'text-primary font-semibold' : 'font-medium'}>{e.period}</span>
                                                <span className="text-base-content/20">/</span>
                                                <span className="text-base-content/60 text-[11px]">{e.meta}</span>
                                            </div>

                                            <h3 className="text-[22px] sm:text-2xl font-semibold tracking-[-0.02em] leading-snug">{e.role}</h3>

                                            <p className="mt-3 text-sm italic leading-relaxed text-base-content/60 max-w-140">{e.desc}</p>

                                            <div className="mt-5 flex flex-wrap gap-2">
                                                {e.tags.map((t) => (
                                                    <span key={t} className="badge badge-outline font-mono tracking-wider">{t}</span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4">
                                            {e.current && <span className="badge badge-primary font-mono font-bold tracking-[0.08em]">{tl.badge}</span>}
                                            <span className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-base-content/20">
                                                {String(i + 1).padStart(2, '0')}
                                            </span>
                                        </div>
                                    </RevealItem>
                                </div>
                                {i < items.length - 1 && <hr />}
                            </li>
                        ))}
                    </ul>
                    </RevealGroup>
                </div>

                <Reveal>
                <footer className="footer sm:footer-horizontal items-center justify-between mt-20 pt-8 border-t border-base-300 font-mono text-[11px] tracking-[0.08em] uppercase">
                    <div className="flex items-center gap-2 text-base-content/60">
                        <span className="text-primary font-bold">{"//"}</span>
                        <span>{tl.more}</span>
                    </div>
                    <a href="#contact" className="btn btn-ghost btn-sm font-mono tracking-[0.08em]">
                        <span>{tl.inquiry}</span>
                        <span className="badge badge-primary badge-xs">→</span>
                    </a>
                </footer>
                </Reveal>
            </div>
        </section>
    )
}

export default Timeline
