export type ChatMessage = { role: "user" | "assistant"; content: string }

// Sends the conversation to /api/chat and reads the plain text stream.
// onText is called with the whole answer so far, every time a new piece arrives.
export async function askAi({ messages, onText }: { messages: ChatMessage[]; onText: (text: string) => void }) {
    const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
    })
    if (!res.ok || !res.body) {
        throw new Error(`Permintaan gagal (${res.status})`)
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let answer = ""

    while (true) {
        const { done, value } = await reader.read()
        if (done) break
        answer += decoder.decode(value, { stream: true })
        onText(answer)
    }

    // streamText hides model errors inside the stream, so a failed call ends up as an empty answer
    if (answer.trim() === "") {
        throw new Error("Jawaban kosong")
    }
    return answer
}
