"use client"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useLang } from "@/app/i18n/useLang"
import { cn, sleep } from "@/libs/utils"
import AuthForm from "@/app/components/auth/form"
import { SubmitHandler } from "react-hook-form"
import { AuthFormValues } from "@/app/schema/form"
import { useLogin, useRegister } from "@/libs/hook/use-auth"
import AlertSucces from "@/app/components/alerts/succes"
import AlertError from "@/app/components/alerts/error"
import { useRouter } from "next/navigation"
import { useFlash } from "@/libs/store/messages"



export type Authmode = 0 | 1;
const COLDOWN = 5
const MAX_FAILED = 4
const REDIRECT_DELAY_MS = 2000

const AuthScreen = () => {
    const { t } = useLang()
    const a = t.auth
    const [mode, setMode] = useState<Authmode>(1)
    const register = useRegister()
    const login = useLogin()
    const { reset: resetLogin } = login
    const [success, setSuccess] = useState<string>("")
    const [error, setError] = useState<string>("")
    const [coldown, setColdown] = useState<number>(0)
    const [failCount, setFailCount] = useState<number>(0)

    const setFlash = useFlash((s) => s.setMessage)

    const router = useRouter()
    const redirecting = login.isSuccess
    const registerDone = register.isSuccess

    useEffect(() => {
        if (coldown <= 0) return
        const id = setTimeout(() => setColdown((s) => s - 1), 1000)
        return () => clearTimeout(id)
    }, [coldown])

    useEffect(() => {
        if (!redirecting) return
        const id = setTimeout(() => resetLogin(), 8000) // unlock after 8s if still here
        return () => clearTimeout(id)
    }, [redirecting, resetLogin])


    const changeMode = (nextMode: Authmode) => {
        if (nextMode === mode) return
        setMode(nextMode)
        setSuccess("")
        setColdown(0)
        setFailCount(0)
        login.reset()
        register.reset()
    }



    const AuthSubmit: SubmitHandler<AuthFormValues> = async (data) => {
        setSuccess('')
        setError('')

        try {

            if (mode === 1) {
                const response = await register.mutateAsync(data)
                setSuccess(response.message || '')
                setFailCount(0)
                return
            }
            
            const response = await login.mutateAsync(data)
            setSuccess(response.message ?? '')
            setFailCount(0)
            await sleep(REDIRECT_DELAY_MS) 
            setFlash(response.message || '')
            router.replace("/dashboard")
        } catch (err) {
            const next = failCount + 1
            setError((err as Error).message)

            if (next >= MAX_FAILED) {
                setColdown(COLDOWN)
                setFailCount(0) // start counting again after the cooldown
            } else {
                setFailCount(next)
            }
        }

    }

        ;


    return (
        // covers the global navbar/footer: the auth screen is its own full-page layout
        <div className="fixed inset-0 z-60 grid grid-cols-12 overflow-y-auto bg-base-100">

            {/* left: illustration */}
            <div className="relative col-span-12 hidden min-h-screen flex-col justify-between overflow-hidden bg-[#0c0e12] p-14 text-white lg:col-span-7 lg:flex">
                <Image src="/assets/bg-login.jpg" alt="" fill priority sizes="60vw" className="object-cover object-center" />
                <div className="absolute inset-0 bg-linear-to-b from-[#0a0c10]/85 via-[#0a0c10]/30 to-[#0a0c10]/90" />

                <div className="relative flex items-center justify-between font-mono text-xs uppercase tracking-wider">
                    <span className="flex items-center gap-3"><span className="status status-primary" /><b className="tracking-[0.16em]">NOPAL.DEV</b></span>
                    <Link href="/" className="text-gray-300 hover:text-white">{a.back}</Link>
                </div>

                <div className="relative my-auto max-w-lg py-12">
                    <span className="mb-6 inline-flex items-center gap-2 border border-white/10 bg-black/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-gray-300">
                        <span className="status status-primary" />{a.badge}
                    </span>
                    <p className="max-w-md text-sm font-light leading-relaxed text-gray-300">{a.intro}</p>
                </div>

                <div className="relative border-t border-white/10 pt-8">
                    <h2 className="max-w-xl text-3xl font-extrabold uppercase leading-tight tracking-[-0.04em]">
                        {a.quoteA}<span className="text-primary">{a.quoteB}</span>
                    </h2>
                    <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-gray-400">{a.note}</p>
                </div>
            </div>

            {/* right: form */}
            <div className="col-span-12 flex min-h-screen flex-col justify-between border-base-300 p-8 lg:col-span-5 lg:border-l lg:p-14">
                <div className="flex items-center justify-between font-mono text-[11px] tracking-wider text-base-content/60">
                    <span className="flex items-center gap-2 font-semibold uppercase text-base-content"><span className="status status-primary" />{a.meta[mode]}</span>
                    <Link href="/" className="uppercase hover:text-base-content lg:hidden">{a.back}</Link>
                    <span className="hidden text-base-content/40 lg:inline">TLS 1.3</span>
                </div>

                <div className="mx-auto my-auto w-full max-w-100 py-10">
                    <h1 className="text-3xl font-extrabold uppercase leading-none tracking-[-0.04em]">
                        {a.h1[mode][0]}<br /><span className="text-primary">{a.h1[mode][1]}</span>
                    </h1>
                    <p className="mt-2.5 mb-8 text-xs leading-normal text-base-content/60">{a.sub}</p>

                    <div role="tablist" className="mb-6 grid grid-cols-2 border border-base-300">
                        {a.tabs.map((tab, i) => (
                            <button key={tab} role="tab" aria-selected={mode === i} onClick={() => changeMode(i as Authmode)}
                                className={cn("py-2.5 font-mono text-xs uppercase tracking-wider", mode === i ? "bg-base-content font-semibold text-base-100" : "bg-base-200 text-base-content/60 hover:text-base-content")}>
                                {tab}
                            </button>
                        ))}
                    </div>


                    <div className="relative mb-6 flex items-center justify-center">
                        <div className="w-full border-t border-base-300" />
                        <span className="absolute bg-base-100 px-3 font-mono text-[10px] uppercase tracking-widest text-base-content/40">{a.or}</span>
                    </div>

                    {/* form  */}
                    {success && <AlertSucces messages={success} />}
                    {error && <AlertError onError={() => setError("")} messages={error} />}
                    <AuthForm key={mode} labels={a} mode={mode} onSubmit={AuthSubmit} coldown={coldown} doneSubmit={registerDone} redirecting={redirecting} />



                    <div className="mt-8 space-y-3 text-center">
                        <p className="text-xs text-base-content/60">
                            {a.switch[mode][0]}{" "}
                            <button type="button" onClick={() => changeMode(mode ? 0 : 1)} className="font-mono font-semibold text-primary hover:underline">{a.switch[mode][1]}</button>
                        </p>
                        <p className="font-mono text-[10px] tracking-wider text-base-content/40">
                            {a.terms[0]} <a href="#" className="underline hover:text-base-content">{a.terms[1]}</a> &amp; <a href="#" className="underline hover:text-base-content">{a.terms[2]}</a>
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between border-t border-base-300 pt-4 font-mono text-[10px] tracking-wider text-base-content/40">
                    <span>NOPAL.DEV {a.system}</span>
                    <span>© 2026</span>
                </div>
            </div>
        </div>
    )
}

export default AuthScreen
