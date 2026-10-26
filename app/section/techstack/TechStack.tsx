"use client"
import { useRef, useState, type ReactNode, type Ref } from "react"
import { motion, useInView } from "motion/react"
import { SiClaude, SiNestjs, SiNextdotjs, SiPostgresql, SiPrisma, SiTailwindcss, SiVercel } from "react-icons/si"
import { RiOpenaiFill } from "react-icons/ri"
import { AnimatedBeam } from "@/app/components/ui/animated-beam"
import { useLang } from "@/app/i18n/useLang"
import { cn } from "@/libs/utils"
import { Reveal } from "@/app/components/animation/Reveal"

// square node (zero radius, per the design system) with its caption below
const Node = ({ ref, name, hub, children }: { ref: Ref<HTMLDivElement>; name: string; hub?: boolean; children: ReactNode }) => (
    <div
        ref={ref}
        title={name}
        className={cn(
            "relative z-10 flex items-center justify-center border border-base-300 bg-base-100",
            hub ? "size-12 p-3 sm:size-16 sm:p-4 border-primary text-primary shadow-[0_0_40px_2px_var(--color-primary)]" : "size-10 p-2.5 sm:size-12 sm:p-3 text-base-content",
        )}
    >
        {children}
        <span className="absolute top-full mt-2 whitespace-nowrap font-mono text-[10px] tracking-wider text-base-content/60">{name}</span>
    </div>
)

const TechStack = () => {
    const { t } = useLang()
    const s = t.stack

    const box = useRef<HTMLDivElement>(null)
    const next = useRef<HTMLDivElement>(null)
    const tailwind = useRef<HTMLDivElement>(null)
    const prisma = useRef<HTMLDivElement>(null)
    const nest = useRef<HTMLDivElement>(null)
    const postgres = useRef<HTMLDivElement>(null)
    const claude = useRef<HTMLDivElement>(null)
    const vercel = useRef<HTMLDivElement>(null)
    const codex = useRef<HTMLDivElement>(null)

    // beams mount (and so start animating) only once the card scrolls into view
    const inView = useInView(box, { once: false, amount: 0.5, })
    // beams measure the nodes when they mount, so they wait until the entrance animation has finished
    const [ready, setReady] = useState(false)
    const enter = { duration: 0.9, ease: [0.16, 1, 0.3, 1] } as const
    const red = { className: "[filter:drop-shadow(0_0_15px_var(--color-primary))_drop-shadow(0_0_10px_var(--color-primary))]", pathOpacity: 0.25, repeatDelay: 0, duration: 7, containerRef: box } as const

    return (
        <section id="stack" className="w-full">
            <div className="container mx-auto p-5 sm:p-10">

                <Reveal once={false} duration={5} className="border-t border-b border-base-300 py-3 flex items-center justify-between text-[8px] md:text-sm tracking-[0.14em] uppercase font-mono text-base-content/60 mb-16 lg:mb-20">
                    <div className="flex items-center gap-3">
                        <span className="status status-primary"></span>
                        <span className="font-semibold text-base-content">{s.eyebrow}</span>
                    </div>
                    <span>6 TOOLS</span>
                </Reveal>

                <Reveal delay={0.1} once={false} className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10 pb-8 border-b border-base-300">
                    <h2 className="text-4xl md:text-5xl lg:text-[54px] leading-[1.05] font-bold tracking-[-0.04em] uppercase">
                        {s.h2a}<br />
                        <span className="text-primary">{s.h2b}</span>
                    </h2>
                    <p className="max-w-lg text-sm leading-relaxed text-base-content/60 lg:text-right">{s.intro}</p>
                </Reveal>

                <div
                    ref={box}
                    role="img"
                    aria-label={s.label}
                    className="relative mx-auto flex h-96 md:h-120 w-full md:max-w-4xl items-center justify-center overflow-hidden border border-base-300 bg-base-100 p-10 pb-12 sm:p-15 sm:pb-14"
                >
                    <div className={cn("flex size-full items-center justify-between gap-3 sm:gap-10")}>
                        <motion.div className="relative flex h-full flex-col justify-start gap-10" initial={{ opacity: 0, x: -48 }} animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -48 }} transition={enter} >
                            <h3 className="absolute bottom-full font-label transform-none mb-2 whitespace-nowrap font-mono text-[11px] font-semibold uppercase leading-none tracking-wider py-2 text-base-content">
                                {""} {s.col}
                            </h3>
                            <Node ref={next} name="NEXT.JS"><SiNextdotjs className="size-full" /></Node>
                            <Node ref={vercel} name="Vercel"><SiVercel className="size-full" /></Node>
                            <Node ref={nest} name="NEST.JS"><SiNestjs className="size-full" /></Node>
                            <Node ref={tailwind} name="TAILWIND CSS"><SiTailwindcss className="size-full" /></Node>
                        </motion.div>

                        <motion.div
                            className="flex items-center gap-2 sm:gap-7"
                            initial={{ opacity: 0, scale: 0.6 }}
                            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
                            transition={{ ...enter, delay: inView ? 0.35 : 0 }}
                            onAnimationComplete={() => setReady(inView)}
                        >
                            <Node ref={claude} name="CLAUDE" hub><SiClaude className="size-full" /></Node>
                            {/* no standalone Codex logo exists in the icon packs, so this is the OpenAI mark */}
                            <Node ref={codex} name="CODEX" hub><RiOpenaiFill className="size-full" /></Node>
                        </motion.div>

                        <motion.div className="flex relative h-full flex-col justify-start gap-10" initial={{ opacity: 0, x: 48 }} animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 48 }} transition={enter}>
                            <h3 className="absolute bottom-full right-0 mb-2 whitespace-nowrap font-mono text-[11px] font-semibold uppercase font-label py-2 leading-none tracking-wider text-base-content">
                                {""} {s.col2}
                            </h3>
                            <Node ref={prisma} name="PRISMA"><SiPrisma className="size-full" /></Node>
                            <Node ref={postgres} name="POSTGRESQL"><SiPostgresql className="size-full" /></Node>
                        </motion.div>
                    </div>

                    {inView && ready && (
                        <motion.div className="absolute inset-0" initial={{ opacity: 0, }} animate={{ opacity: 10 }} transition={{ duration: 10 }}>
                            <AnimatedBeam {...red} fromRef={next} toRef={claude} curvature={-75} endYOffset={-10} />
                            <AnimatedBeam {...red} fromRef={vercel} toRef={claude} curvature={10} endYOffset={3} />
                            <AnimatedBeam {...red} fromRef={tailwind} toRef={claude} curvature={75} endYOffset={10} />
                            <AnimatedBeam {...red} fromRef={prisma} toRef={codex} curvature={-75} endYOffset={-10} reverse />
                            <AnimatedBeam {...red} fromRef={postgres} toRef={codex} curvature={5} endYOffset={10} reverse />
                            <AnimatedBeam {...red} fromRef={nest} toRef={claude} curvature={-10} endYOffset={-10} />
                            <AnimatedBeam {...red} fromRef={claude} toRef={codex} reverse />
                            <AnimatedBeam {...red} fromRef={codex} toRef={claude} reverse />
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default TechStack
