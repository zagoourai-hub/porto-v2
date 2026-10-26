'use client'
import { motion, useReducedMotion } from "motion/react";

// Decorative floating cards on the right of the hero heading.
// Outer motion.div = staggered entrance, inner motion.div = endless float, so the two never fight.

const card = "border border-white/15 bg-[#0b0d12]/85 font-mono text-[11px] tracking-[0.06em] text-white/70 shadow-none";

const cards = [
    {
        pos: "left-0 top-0 w-72", float: { y: [0, -14, 0], rotate: [-2, -1, -2] }, duration: 6,
        body: (
            <>
                <div className="flex items-center justify-between border-b border-white/10 px-3 py-2 uppercase text-white/40">
                    <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 bg-primary" />hero.tsx</span>
                    <span>TSX</span>
                </div>
                <pre className="px-3 py-3 leading-relaxed not-italic">
                    <span className="text-primary">const</span> dev = {"{"}{"\n"}
                    {"  "}stack: [<span className="text-secondary">&quot;next&quot;</span>, <span className="text-secondary">&quot;ts&quot;</span>],{"\n"}
                    {"  "}ships: <span className="text-primary">true</span>,{"\n"}
                    {"}"}
                </pre>
            </>
        ),
    },
    {
        pos: "right-0 top-32 w-64", float: { y: [0, 12, 0], rotate: [2, 3, 2] }, duration: 7,
        body: (
            <div className="space-y-1.5 px-3 py-3">
                <div className="uppercase text-white/40">~/portfolio</div>
                <div><span className="text-primary">$</span> pnpm build</div>
                <div className="text-white/40">compiling…</div>
                <div className="flex items-center gap-2 text-white"><span className="h-1.5 w-1.5 bg-primary" />ready</div>
            </div>
        ),
    },
    {
        pos: "left-10 top-72 w-60", float: { y: [0, -10, 0], rotate: [-1, 0, -1] }, duration: 5,
        body: (
            <div className="px-3 py-3">
                <div className="mb-2 uppercase text-white/40">{"// stack"}</div>
                <div className="flex flex-wrap gap-1.5">
                    {["NEXT.JS", "REACT", "TAILWIND", "GSAP"].map((t) => (
                        <span key={t} className="border border-white/20 px-1.5 py-0.5 not-italic text-white">{t}</span>
                    ))}
                </div>
            </div>
        ),
    },
];

const HeroCards = ({ className = "" }: { className?: string }) => {
    const reduce = useReducedMotion();

    return (
        <div aria-hidden className={`pointer-events-none relative h-104 w-104 ${className}`}>
            {cards.map((c, i) => (
                <motion.div
                    key={i}
                    className={`absolute ${c.pos}`}
                    initial={reduce ? false : { opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                >
                    <motion.div
                        className={card}
                        animate={reduce ? undefined : c.float}
                        transition={{ duration: c.duration, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                    >
                        {c.body}
                    </motion.div>
                </motion.div>
            ))}
        </div>
    );
};

export default HeroCards;
