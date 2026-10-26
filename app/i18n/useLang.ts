"use client"
import { useSyncExternalStore } from "react"
import { dict, type Lang } from "./dict"

// <html lang> is the source of truth: layout.tsx sets it from localStorage before paint.
const subscribe = (cb: () => void) => {
    window.addEventListener("langchange", cb)
    return () => window.removeEventListener("langchange", cb)
}
const snapshot = (): Lang => (document.documentElement.lang === "id" ? "id" : "en")
const serverSnapshot = (): Lang => "en"

export const setLang = (l: Lang) => {
    document.documentElement.lang = l
    try { localStorage.setItem("lang", l) } catch { }
    window.dispatchEvent(new Event("langchange"))
}

export const useLang = () => {
    const lang = useSyncExternalStore(subscribe, snapshot, serverSnapshot)
    return { lang, t: dict[lang], setLang }
}
