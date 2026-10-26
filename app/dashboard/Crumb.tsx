"use client"
import { usePathname } from "next/navigation"
import { dim, mono } from "./ui"

const names: Record<string, string> = {
    "/dashboard": "RINGKASAN",
    "/dashboard/proyek": "PROYEK",
    "/dashboard/pesan": "PESAN MASUK",
    "/dashboard/pengaturan": "PENGATURAN",
}

const Crumb = () => {
    const pathname = usePathname()
    return (
        <div className={`flex items-center gap-2 text-xs ${mono}`}>
            <span className={`hidden sm:inline ${dim}`}>DASHBOARD</span>
            <span className={`hidden sm:inline ${dim}`}>/</span>
            <span className="font-bold">{names[pathname] ?? "RINGKASAN"}</span>
        </div>
    )
}

export default Crumb
