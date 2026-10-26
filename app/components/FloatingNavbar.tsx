"use client"
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MovingBorder } from "@/app/components/ui/moving-border";
import { useLang } from "@/app/i18n/useLang";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export type NavLink = { label: string; href: string }

type FloatingNavbarProps = {
    brand: string
    links: NavLink[]
    cta?: NavLink
}

const FloatingNavbar = ({ brand, links, cta }: FloatingNavbarProps) => {
    const header = useRef<HTMLElement>(null);
    const nav = useRef<HTMLElement>(null);
    const bg = useRef<HTMLDivElement>(null);
    const toggle = useRef<HTMLInputElement>(null);
    const { lang, setLang, t } = useLang();

    // the saved theme is applied to <html> before paint by the inline script in layout.tsx;
    // here we only sync the checkbox with it
    useEffect(() => {
        if (toggle.current) toggle.current.checked = document.documentElement.dataset.theme === "dark";
    }, []);

    const onToggle = (dark: boolean) => {
        const theme = dark ? "dark" : "portfolio";
        document.documentElement.dataset.theme = theme;
        try { localStorage.setItem("theme", theme) } catch { }
    };

    useGSAP(() => {
        // top of page: full width + transparent. Over the first 300px (scrubbed) it
        // detaches from the edge, narrows, and the dark background fades in.
        gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { start: 0, end: 300, scrub: true } })
            .fromTo(header.current, { top: 0, paddingInline: 0 }, { top: 16, paddingInline: 16 }, 0)
            .fromTo(nav.current, { maxWidth: "100%" }, { maxWidth: "64rem" }, 0)
            .fromTo(bg.current, { opacity: 0 }, { opacity: 1 }, 0);

    }, { scope: header });

    const langToggle = (
        <label className="flex cursor-pointer items-center gap-1.5" title={t.nav.language}>
            <span className={lang === "en" ? "text-base-content" : "text-base-content/40"}>EN</span>
            <input type="checkbox" aria-label={t.nav.language} checked={lang === "id"} onChange={(e) => setLang(e.target.checked ? "id" : "en")} className="toggle toggle-xs sm:toggle-sm" />
            <span className={lang === "id" ? "text-base-content" : "text-base-content/40"}>ID</span>
        </label>
    );

    return (
        <header ref={header} className="fixed top-0 inset-x-0 z-50 flex justify-center pointer-events-none">
            <nav ref={nav} data-theme="dark" className="navbar relative bg-transparent pointer-events-auto w-full max-w-full min-h-0 px-4 md:px-10 py-2 text-base-content font-mono text-[11px] sm:text-xs tracking-[0.08em] uppercase">
                {/* appears only after scrolling: orbiting red glow (moving border) + dark fill over its inside */}
                <div ref={bg} aria-hidden style={{ opacity: 0 }} className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                    <MovingBorder duration={4000} rx="0" ry="0">
                        <div className="h-10 w-50 bg-[radial-gradient(var(--color-primary)_40%,transparent_50%)] opacity-60" />
                    </MovingBorder>
                    <div className="absolute inset-px bg-base-100/90 backdrop-blur-md" />
                </div>
                <div className="container mx-auto flex items-center">
                <div className="navbar-start min-w-0 gap-2 sm:gap-3">
                    <div className="dropdown md:hidden">
                        <button tabIndex={0} aria-label={t.nav.menu} className="btn btn-ghost btn-sm btn-square text-base">☰</button>
                        <ul
                            tabIndex={0}
                            onClick={() => (document.activeElement as HTMLElement | null)?.blur()}
                            className="menu dropdown-content mt-3 w-[min(14rem,calc(100vw-2rem))] p-2 bg-base-100 text-base-content border border-base-content/15"
                        >
                            {links.map((l) => (
                                <li key={l.href}><a href={l.href} className="py-3">{l.label}</a></li>
                            ))}
                            <li className="sm:hidden" onClick={(e) => e.stopPropagation()}><div className="py-3">{langToggle}</div></li>
                        </ul>
                    </div>
                    <a href="#" className="flex min-w-0 items-center gap-2 animate-pulse font-bold">
                        <span className="status status-primary shrink-0"></span>
                        <span className="truncate">{brand}</span>
                    </a>
                </div>

                <ul className="navbar-center menu menu-horizontal hidden md:flex gap-1 p-0">
                    {links.map((l) => (
                        <li key={l.href}><a href={l.href}>{l.label}</a></li>
                    ))}
                </ul>

                <div className="navbar-end gap-2 sm:gap-4">
                    <div className="hidden sm:flex">{langToggle}</div>
                    <label className="flex cursor-pointer items-center gap-1.5 sm:gap-2" title="Toggle dark / light mode">
                        <svg className="hidden sm:block" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <circle cx="12" cy="12" r="5" />
                            <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                        </svg>
                        <input ref={toggle} type="checkbox" value="dark" aria-label={t.nav.darkMode} onChange={(e) => onToggle(e.target.checked)} className="toggle theme-controller toggle-xs sm:toggle-sm" />
                        <svg className="hidden sm:block" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        </svg>
                    </label>
                    {cta && (
                        <a href={cta.href} className="btn btn-primary btn-xs sm:btn-sm font-mono tracking-[0.08em]">{cta.label}</a>
                    )}
                </div>
                </div>
            </nav>
        </header>
    )
}

export default FloatingNavbar
