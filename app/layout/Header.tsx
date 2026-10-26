"use client"
import FloatingNavbar, { type NavLink } from "@/app/components/FloatingNavbar";
import { useLang } from "@/app/i18n/useLang";

const Header = () => {
    const { t } = useLang();
    const links: NavLink[] = [
        { label: t.nav.about, href: "#about" },
        { label: t.nav.timeline, href: "#timeline" },
        { label: t.nav.contact, href: "#contact" },
        { label: t.nav.ask, href: "/chat" },
    ];

    return (
        <FloatingNavbar
            brand={t.nav.brand}
            links={links}
            cta={{ label: t.nav.hire, href: "#contact" }}
        />
    );
};

export default Header;
