const months = ["JAN", "FEB", "MAR", "APR", "MEI", "JUN", "JUL", "AGU", "SEP", "OKT", "NOV", "DES"]

export const fmtDate = (iso: string) => {
    const d = new Date(iso)
    return `${String(d.getDate()).padStart(2, "0")} ${months[d.getMonth()]} ${d.getFullYear()}`
}

export const timeAgo = (iso: string) => {
    const min = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60_000))
    if (min < 60) return `${Math.max(1, min)}M LALU`
    if (min < 60 * 24) return `${Math.floor(min / 60)}J LALU`
    if (min < 60 * 48) return "KEMARIN"
    return fmtDate(iso)
}
