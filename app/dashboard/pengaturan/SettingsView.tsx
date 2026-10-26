"use client"
import { useForm } from "react-hook-form"
import { useSettings, useUpdateSettings } from "../lib/queries"
import type { Settings } from "../lib/types"
import { fieldBase, FieldError, legend, mono, muted, Panel, QueryState } from "../ui"

const SettingsForm = ({ initial }: { initial: Settings }) => {
    const save = useUpdateSettings()
    const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<Settings>({ defaultValues: initial })

    return (
        <form onSubmit={handleSubmit((v) => save.mutate(v, { onSuccess: () => reset(v) }))} className="grid grid-cols-1 gap-6 p-5 md:grid-cols-2" noValidate>
            <fieldset className="fieldset">
                <legend className={legend}>NAMA TAMPIL</legend>
                <input {...register("displayName", { required: "Nama wajib diisi" })} aria-invalid={!!errors.displayName} className={`input input-ghost ${fieldBase}`} />
                <FieldError message={errors.displayName?.message} />
            </fieldset>

            <fieldset className="fieldset">
                <legend className={legend}>EMAIL KONTAK</legend>
                <input
                    {...register("contactEmail", {
                        required: "Email wajib diisi",
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Format email tidak valid" },
                    })}
                    type="email"
                    aria-invalid={!!errors.contactEmail}
                    className={`input input-ghost ${fieldBase}`}
                />
                <FieldError message={errors.contactEmail?.message} />
            </fieldset>

            <fieldset className="fieldset">
                <legend className={legend}>LOKASI</legend>
                <input {...register("location", { required: "Lokasi wajib diisi" })} aria-invalid={!!errors.location} className={`input input-ghost ${fieldBase}`} />
                <FieldError message={errors.location?.message} />
            </fieldset>

            <fieldset className="fieldset">
                <legend className={legend}>KETERSEDIAAN</legend>
                <select {...register("availability")} className={`select select-ghost ${fieldBase}`}>
                    <option value="open">TERBUKA UNTUK PROYEK</option>
                    <option value="busy">SEDANG PENUH</option>
                </select>
            </fieldset>

            <fieldset className="fieldset md:col-span-2">
                <legend className={legend}>CATATAN KETERSEDIAAN</legend>
                <textarea {...register("note", { maxLength: { value: 160, message: "Maksimal 160 karakter" } })} rows={3} className={`textarea textarea-ghost resize-none ${fieldBase}`} />
                <FieldError message={errors.note?.message} />
            </fieldset>

            <div className="flex flex-wrap items-center gap-3 md:col-span-2">
                <button type="submit" disabled={save.isPending || !isDirty} className={`btn btn-primary btn-sm ${mono}`}>{save.isPending ? "MENYIMPAN…" : "SIMPAN PENGATURAN"}</button>
                <button type="button" onClick={() => reset(initial)} disabled={!isDirty} className={`btn btn-ghost btn-sm ${mono}`}>BATALKAN</button>
                {save.isError && <span role="alert" className={`text-[11px] text-error ${mono}`}>{save.error.message}</span>}
                {save.isSuccess && !isDirty && <span className={`text-[11px] text-success ${mono}`}>TERSIMPAN</span>}
            </div>
        </form>
    )
}

const SettingsView = () => {
    const settings = useSettings()

    return (
        <>
            <div className="border-b border-base-300 pb-6">
                <div className={`mb-2 text-[11px] uppercase ${muted} ${mono}`}>{"//"} PROFIL & KETERSEDIAAN</div>
                <h1 className="text-3xl font-extrabold leading-none tracking-[-0.04em] md:text-4xl">PENGATURAN<span className="text-primary">.</span></h1>
            </div>

            <Panel title="PROFIL PUBLIK" dot="primary" className="max-w-3xl">
                <QueryState q={settings} rows={4}>
                    {settings.data && <SettingsForm initial={settings.data} />}
                </QueryState>
            </Panel>
        </>
    )
}

export default SettingsView
