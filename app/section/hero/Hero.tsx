'use client'
import { Button } from "@/app/components/ui/moving-border";
import { Particles } from "@/app/components/ui/particles";
import { Expand } from "lucide-react";
import Image from "next/image";
import { useLang } from "@/app/i18n/useLang";
import { useEffect, useState } from "react";
import HeroCards from "./HeroCards";
import { RevealGroup, RevealItem } from "@/app/components/animation/Reveal";

const TYPE_MS = 90, DELETE_MS = 40, HOLD_MS = 1800, EMPTY_MS = 400;

// Starts with the full text (fast first paint, no-JS and reduced-motion friendly),
// then loops: hold -> delete -> pause -> type again.
function useTypewriter(length: number) {
    const [n, setN] = useState(length);
    useEffect(() => {
        if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        let count = length, deleting = true, id: ReturnType<typeof setTimeout>;
        const tick = () => {
            count += deleting ? -1 : 1;
            setN(count);
            let delay = deleting ? DELETE_MS : TYPE_MS;
            if (count === 0) { deleting = false; delay = EMPTY_MS; }
            else if (count === length) { deleting = true; delay = HOLD_MS; }
            id = setTimeout(tick, delay);
        };
        id = setTimeout(tick, HOLD_MS);
        return () => clearTimeout(id);
    }, [length]);
    return n;
}

type Part = { text: string; className?: string };

// "\n" parts render as <br />. Remount with key={text} so a language switch restarts the loop.
const TypedHeading = ({ parts, className }: { parts: Part[]; className: string }) => {
    const full = parts.map((p) => p.text).join("");
    const n = useTypewriter(full.length);

    const render = (limit: number) => {
        let left = limit;
        return parts.map((p, i) => {
            const shown = p.text.slice(0, Math.max(0, left));
            left -= p.text.length;
            if (p.text === "\n") return shown && <br key={i} />;
            return <span key={i} className={p.className}>{shown}</span>;
        });
    };

    return (
        <h1 aria-label={full.replace("\n", " ")} className={`relative ${className}`}>
            {/* invisible full copy reserves the final size, so typing never shifts the layout */}
            <span aria-hidden className="invisible">{render(full.length)}</span>
            <span aria-hidden className="absolute inset-0">
                {render(n)}
                <span className="ml-1 inline-block h-[0.8em] w-[0.08em] bg-primary align-baseline animate-pulse" />
            </span>
        </h1>
    );
};

const Hero = () => {
    const { t } = useLang();
    const h = t.hero;
    return (
        <section className="overflow-x-hidden mih-h-screen">
            <main className="relative w-full min-h-95 md:min-h-screen ">
                <div className="w-full h-[45vh]  ">
                    <Image
                        src="/assets/bg-hero.png"
                        alt="Hero background"
                        fill
                        sizes="100vw"
                        loading="eager"
                        className="object-center md:object-cover"
                    />
                    <div className="bg-linear-to-tl absolute top-0 w-full  h-full from-black to-black/4 0"></div>
                    <div className="bg-linear-to-tr absolute top-0 w-[400vh] h-full from-black"></div>
                </div>
                {/* red particles over the image + gradients, under the text; follow the cursor */}
                <Particles className="absolute inset-0 mix-blend-screen motion-reduce:hidden" quantity={90} size={0.8} staticity={40} ease={60} vy={-0.08} />
                {/* xl+ only: below 1280px the cards would overlap the 10vh heading */}
                <HeroCards className="absolute! right-[15vw] top-1/2 -translate-y-1/2 hidden xl:block" />
                <div className="container mx-auto items-start flex md:px-20 px-7 flex-col absolute top-20 md:inset-0 justify-center">
                    <RevealGroup className="md:space-y-5 space-y-2" stagger={0.15} delay={0.2}>
                        <RevealItem>
                        <Button
                            borderRadius="1.75rem"
                            duration={4000}
                            className="bg-transparent md:h-10  dark:text-white border-neutral-200 dark:border-slate-800"
                        >
                            <span className="uppercase font-label  md:text-[15px] text-[8px] tracking-meta inline-block animate-pulse status-pulse">{h.role} <span className="text-white/20">{" // "}</span> <span className="text-white">{h.status}</span></span>
                        </Button>
                        </RevealItem>
                        <div className="">
                            <TypedHeading
                                key={h.h1a + h.h1b + h.h1c}
                                className="font-heading  md:text-[10vh] text-5xl md:leading-22 text-primary-content"
                                parts={[{ text: h.h1a }, { text: "\n" }, { text: h.h1b }, { text: h.h1c, className: "text-primary" }]}
                            />
                            <RevealItem>
                            <p className=" text-gray-500 text-xs md:text-lg italic text-balance">
                                {h.p1} <br />
                                {h.p2}
                            </p>
                            </RevealItem>
                        </div>
                        <RevealItem className="space-x-2 font-label">
                            <button className="btn btn-xs hover:bg-accent uppercase  sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl btn-primary">{h.work}</button>
                            <button className="btn  gap-3 btn-xs uppercase border-hairline border-white/25 hover:border-white hover:bg-white/5 transition-all duration-150 sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl bg-transparent text-accent-content">
                                {h.cv}
                                <Expand className="md:w-4 w-2" />
                            </button>
                        </RevealItem>
                    </RevealGroup>
                </div>
            </main>
        </section>
    );
};

export default Hero;
