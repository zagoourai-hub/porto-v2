"use client"
import { useState, type ReactNode } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ApiError } from "./lib/api"

const Providers = ({ children }: { children: ReactNode }) => {
    // created once per browser session, never at module level (would be shared between requests on the server)
    const [client] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 30_000,
                        // a 401/403/404 will not change on retry; network and 5xx errors get one more try
                        retry: (count, error) => !(error instanceof ApiError && error.status < 500) && count < 1,
                        refetchOnWindowFocus: false,
                    },
                },
            }),
    )
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

export default Providers
