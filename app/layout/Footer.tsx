"use client"
import { useLang } from "@/app/i18n/useLang"

const socials = [
    { label: "GITHUB", href: "#" },
    { label: "LINKEDIN", href: "#" },
    { label: "INSTAGRAM", href: "#" },
    { label: "X", href: "#" },
]

const Footer = () => {
    const { t } = useLang()
    return (
    <footer className="relative w-full overflow-hidden border-t border-base-300">
        <div className="footer container mx-auto px-5 sm:px-10 py-10 gap-6 md:flex md:items-center md:justify-between relative z-10 font-mono text-xs tracking-[0.08em]">
            <aside className="flex items-center gap-2.5 text-sm tracking-widest font-semibold">
                <span className="status status-primary"></span>
                WEB DEVELOPER
            </aside>

            <nav className="flex flex-wrap items-center gap-6 sm:gap-8 text-base-content/60">
                {socials.map((s) => (
                    <a key={s.label} href={s.href} className="hover:text-base-content transition-colors">{s.label} ↗</a>
                ))}
            </nav>

            <div className="flex items-center gap-6 text-base-content/60">
                <span>© 2026 WEB DEVELOPER</span>
                <span className="text-base-content/20">/</span>
                <a href="#" className="hover:text-base-content transition-colors">{t.footer.top}</a>
            </div>
        </div>

        <div aria-hidden className="w-full flex justify-center items-end select-none pointer-events-none -mb-8 sm:-mb-12 md:-mb-16 overflow-hidden">
            <span className="text-[10vw] font-extrabold leading-none tracking-tighter uppercase text-transparent opacity-10 [-webkit-text-stroke:1px_var(--color-base-content)]">
                WEB DEVELOPER
            </span>
        </div>
    </footer>
    )
}

export default Footer
