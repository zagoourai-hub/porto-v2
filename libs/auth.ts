import { APIError, betterAuth} from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { openAPI } from "better-auth/plugins"
import { userDataSchema, userUpdateSchema } from "@/app/schema/auth";
import { i18n, locales, type TranslationDictionary } from "@better-auth/i18n";
import z from "zod";
import { createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";



function badRequest(error: z.ZodError): never {
  throw new APIError("BAD_REQUEST", { message: z.prettifyError(error) });
}

const SUCCESS_MESSAGES: Record<string, string> = {
  "/sign-in/email": "Anjay Login berhasil",
  "/sign-up/email": "Sip, Akun berhasil dibuat",
};


const idMessages: TranslationDictionary = {
  ...locales.id,
  INVALID_EMAIL_OR_PASSWORD: "Email atau kata sandi salah",
  INVALID_PASSWORD: "Email atau kata sandi salah",
  USER_NOT_FOUND: "Email atau kata sandi salah",
};

export const auth = betterAuth({
   database: prismaAdapter(prisma, { provider: "sqlite" }),
   trustedOrigins: ['http://localhost:3000', 'https://granny-sampling-hesitant.ngrok-free.dev'],
   emailAndPassword : {
    enabled:true
   },
   hooks:{
      after: createAuthMiddleware(async (ctx) => {
      const message = SUCCESS_MESSAGES[ctx.path];
      if (!message) return;

      const returned = ctx.context.returned;
      if (returned instanceof APIError) return;

      return ctx.json({ ...(returned as Record<string, unknown>), message });
    }),
   },
     databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const result = userDataSchema.safeParse(user);
          if (!result.success) badRequest(result.error);

          // Spread dulu data asli supaya field lain (emailVerified, dll.) tidak hilang
          return { data: { ...user, ...result.data } };
        },
      },
      update: {
        before: async (data) => {
          const result = userUpdateSchema.safeParse(data);
          if (!result.success) badRequest(result.error);

          return { data: { ...data, ...result.data } };
        },
        
      },
    },
  },
   plugins : [
      i18n({
      translations: { id: idMessages },
      defaultLocale: "id",
      }),
      nextCookies(),
    openAPI()
   ]
});