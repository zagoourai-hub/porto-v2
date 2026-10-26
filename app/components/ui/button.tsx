'use client'
import { signOut } from "@/libs/auth-client";


export default function Button() {
    return (
        <button className="btn" onClick={() => signOut()}>Keluar </button>
    )
}