"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { cn } from "@/libs/utils"
import { fmtDate } from "../lib/format"
import { useCreateProject, useDeleteProject, useProjects, useUpdateProject } from "../lib/queries"
import type { Project, ProjectInput } from "../lib/types"
import { dim, fieldBase, FieldError, legend, mono, muted, Panel, QueryState } from "../ui"

const empty: ProjectInput = { name: "", stack: "", status: "draft" }

// key={project?.id ?? "new"} on the caller remounts this form, so defaultValues always match the selection
const ProjectForm = ({ project, onDone }: { project: Project | null; onDone: () => void }) => {
    const create = useCreateProject()
    const update = useUpdateProject()
    const remove = useDeleteProject()

    const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<ProjectInput>({
        defaultValues: project ? { name: project.name, stack: project.stack, status: project.status } : empty,
    })

    const save = project ? update : create
    const busy = save.isPending || remove.isPending

    const onSubmit = handleSubmit((values) => {
        if (project) update.mutate({ ...values, id: project.id }, { onSuccess: () => reset(values) })
        else create.mutate(values, { onSuccess: () => reset(empty) })
    })

    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-6 p-5" noValidate>
            <fieldset className="fieldset">
                <legend className={legend}>NAMA PROYEK</legend>
                <input
                    {...register("name", { required: "Nama proyek wajib diisi", minLength: { value: 3, message: "Minimal 3 karakter" } })}
                    placeholder="Nama proyek"
                    aria-invalid={!!errors.name}
                    className={`input input-ghost ${fieldBase}`}
                />
                <FieldError message={errors.name?.message} />
            </fieldset>

            <fieldset className="fieldset">
                <legend className={legend}>STACK UTAMA</legend>
                <input
                    {...register("stack", { required: "Stack wajib diisi" })}
                    placeholder="Stack utama"
                    aria-invalid={!!errors.stack}
                    className={`input input-ghost ${fieldBase}`}
                />
                <FieldError message={errors.stack?.message} />
            </fieldset>

            <fieldset className="fieldset">
                <legend className={legend}>STATUS</legend>
                <select {...register("status")} className={`select select-ghost ${fieldBase}`}>
                    <option value="live">TAYANG</option>
                    <option value="draft">DRAF</option>
                </select>
            </fieldset>

            {save.isError && <div role="alert" className="alert alert-error text-xs">{save.error.message}</div>}
            {save.isSuccess && !isDirty && <p className={`text-[11px] text-success ${mono}`}>TERSIMPAN</p>}

            <div className="flex flex-wrap items-center gap-3">
                <button type="submit" disabled={busy || (!!project && !isDirty)} className={`btn btn-primary btn-sm ${mono}`}>
                    {save.isPending ? "MENYIMPAN…" : project ? "SIMPAN PERUBAHAN" : "TAMBAH PROYEK"}
                </button>
                {project && (
                    <>
                        <button type="button" onClick={onDone} className={`btn btn-ghost btn-sm ${mono}`}>BATAL</button>
                        <button
                            type="button"
                            disabled={busy}
                            onClick={() => window.confirm(`Hapus "${project.name}"?`) && remove.mutate(project.id, { onSuccess: onDone })}
                            className={`btn btn-outline btn-error btn-sm ml-auto ${mono}`}
                        >
                            HAPUS
                        </button>
                    </>
                )}
            </div>
        </form>
    )
}

const ProjectsView = () => {
    const projects = useProjects()
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const selected = projects.data?.find((p) => p.id === selectedId) ?? null

    return (
        <>
            <div className="flex flex-col justify-between gap-4 border-b border-base-300 pb-6 md:flex-row md:items-end">
                <div>
                    <div className={`mb-2 text-[11px] uppercase ${muted} ${mono}`}>{"//"} KELOLA PORTOFOLIO</div>
                    <h1 className="text-3xl font-extrabold leading-none tracking-[-0.04em] md:text-4xl">PROYEK<span className="text-primary">.</span></h1>
                </div>
                <button onClick={() => setSelectedId(null)} className={`btn btn-outline btn-sm ${mono}`}>+ PROYEK BARU</button>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                <Panel
                    className="lg:col-span-7"
                    title="DAFTAR PROYEK"
                    aside={<span className={`text-[10px] ${dim} font-mono`}>{projects.data ? `${projects.data.length} ITEM` : "—"}</span>}
                >
                    <QueryState q={projects} rows={5}>
                        <div className="divide-y divide-base-300">
                            {projects.data?.length === 0 && <p className={`p-5 text-xs ${muted} font-mono`}>BELUM ADA PROYEK. TAMBAHKAN DI FORM SEBELAH.</p>}
                            {projects.data?.map((p, i) => (
                                <button
                                    key={p.id}
                                    onClick={() => setSelectedId(p.id)}
                                    aria-pressed={p.id === selectedId}
                                    className={cn("flex w-full items-center justify-between gap-3 p-3.5 text-left transition-colors hover:bg-base-200", p.id === selectedId && "bg-base-200")}
                                >
                                    <span className="min-w-0">
                                        <span className="flex items-center gap-2">
                                            <span className={`text-[10px] ${dim} font-mono`}>{String(i + 1).padStart(2, "0")}</span>
                                            <span className="truncate text-xs font-bold">{p.name}</span>
                                            {p.status === "live"
                                                ? <span className={`badge badge-success badge-soft badge-xs text-[9px] font-bold ${mono}`}>TAYANG</span>
                                                : <span className={`badge badge-ghost badge-xs text-[9px] font-bold ${mono}`}>DRAF</span>}
                                        </span>
                                        <span className={`mt-1 block truncate pl-5 text-[10px] ${muted} font-mono`}>UPDATE: {fmtDate(p.updatedAt)} · {p.stack}</span>
                                    </span>
                                    <span className={`btn btn-outline btn-xs pointer-events-none font-mono text-[10px]`}>EDIT</span>
                                </button>
                            ))}
                        </div>
                    </QueryState>
                </Panel>

                <Panel className="self-start lg:col-span-5" title={selected ? "UBAH PROYEK" : "PROYEK BARU"} dot="primary">
                    <ProjectForm key={selected?.id ?? "new"} project={selected} onDone={() => setSelectedId(null)} />
                </Panel>
            </div>
        </>
    )
}

export default ProjectsView
