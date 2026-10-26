// libs/validations/auth.ts
import { z } from "zod";

export const userDataSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(50),
  email: z.email("Invalid email address").toLowerCase(),
});

export const userUpdateSchema = userDataSchema.partial();

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128)
  .regex(/[A-Z]/, "Must contain an uppercase letter")
  .regex(/[0-9]/, "Must contain a number");

export const signUpSchema = userDataSchema.extend({ password: passwordSchema });
export const signInSchema = signUpSchema.pick({ email: true, password: true });