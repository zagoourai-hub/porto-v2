import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { createTextStreamResponse, streamText, toTextStream } from "ai"

// reads OPENROUTER_API_KEY from .env
const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY })

// POST /api/chat
// body:     { messages: [{ role: "user" | "assistant", content: "..." }] }
// response: the answer as a plain text stream
export async function POST(request: Request) {
    const body = await request.json().catch(() => null)
    if (!Array.isArray(body?.messages)) {
        return Response.json({ error: "Body harus berisi daftar messages" }, { status: 400 })
    }

    // keep the last 10 messages, and only "user" / "assistant" text (a visitor can not send their own "system" message)
    const messages: { role: "user" | "assistant"; content: string }[] = []
    for (const m of body.messages.slice(-10)) {
        if ((m.role === "user" || m.role === "assistant") && typeof m.content === "string") {
            messages.push({ role: m.role, content: m.content.slice(0, 2000) })
        }
    }

    if (messages.length === 0) {
        return Response.json({ error: "Tidak ada pesan yang bisa diproses" }, { status: 400 })
    }

    const result = streamText({
        // "openrouter/free" lets OpenRouter pick an available free model. Set OPENROUTER_MODEL to use a specific one,
        // for example "google/gemma-4-31b-it:free".
        model: openrouter.chat(process.env.OPENROUTER_MODEL ?? "openrouter/free"),
        system:
            "Kamu adalah asisten di website portofolio seorang web developer. " +
            "Selalu jawab dalam bahasa Indonesia, singkat dan jelas, apa pun bahasa yang dipakai pengunjung. " +
            "Hanya jawab pertanyaan seputar website portofolio ini: developernya, proyek, skill, tech stack, dan cara menghubunginya. " +
            "Kalau pertanyaannya di luar itu (misalnya pengetahuan umum, coding umum, berita, atau obrolan lain), tolak dengan sopan dalam satu kalimat dan arahkan pengunjung kembali bertanya tentang portofolio ini. " +
            "Kamu belum punya data asli developernya, jadi jangan mengarang proyek, harga, ketersediaan, atau kontak. " +
            "Kalau ditanya hal itu, katakan kamu belum punya informasinya dan sarankan memakai bagian kontak di website.",
        maxOutputTokens: 500,
        messages,
        // streamText does not throw, errors become part of the stream. Log them here.
        onError({ error }) {
            console.error("[api/chat]", error)
        },
    })

    return createTextStreamResponse({
        stream: toTextStream({ stream: result.stream }),
    })
}
