import z from "zod";

const formSchema = z.object({
    name: z.string().optional(),
    email: z.email("Format email tidak valid"),
    password: z.string().min(8, "Password minimal 8 karakter"),
})

export const LoginSchema = formSchema
export const RegisterSchema = formSchema.extend({
     name: z.string().min(2, "Nama minimal 2 karakter"),
     password: z
    .string()
    .min(8, "Minimal 8 karakter")
    .regex(/\d/, "Harus ada minimal 1 angka")
    .regex(/[a-z]/, "Harus ada minimal 1 huruf kecil")
    .regex(/[A-Z]/, "Harus ada minimal 1 huruf besar"),
})
export type AuthFormValues = z.infer<typeof formSchema>;