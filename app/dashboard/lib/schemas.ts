import { z } from "zod"

// Validation at the API boundary. The forms validate for UX; this is what the server actually trusts.

export const projectInputSchema = z.object({
    name: z.string().trim().min(3, "Nama proyek minimal 3 karakter").max(80, "Nama proyek maksimal 80 karakter"),
    stack: z.string().trim().min(1, "Stack wajib diisi").max(80, "Stack maksimal 80 karakter"),
    status: z.enum(["live", "draft"], "Status harus live atau draft"),
})

// either send a reply (marks the message replied) or just flip the status
export const messagePatchSchema = z.union([
    z.object({ reply: z.string().trim().min(10, "Balasan minimal 10 karakter").max(4000, "Balasan terlalu panjang") }),
    z.object({ status: z.enum(["new", "replied"], "Status harus new atau replied") }),
])

export const settingsSchema = z.object({
    displayName: z.string().trim().min(1, "Nama wajib diisi").max(80),
    contactEmail: z.email("Format email tidak valid"),
    location: z.string().trim().min(1, "Lokasi wajib diisi").max(120),
    availability: z.enum(["open", "busy"], "Ketersediaan harus open atau busy"),
    note: z.string().trim().max(160, "Catatan maksimal 160 karakter"),
})
