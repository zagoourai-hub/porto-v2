"use client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "./api"

// one query key per resource; a mutation invalidates the key it changes so the list refetches
export const keys = {
    projects: ["projects"] as const,
    messages: ["messages"] as const,
    settings: ["settings"] as const,
}

// ---- reads
export function useProjects() {
    return useQuery({ queryKey: keys.projects, queryFn: api.projects.list })
}

export function useMessages() {
    return useQuery({ queryKey: keys.messages, queryFn: api.messages.list })
}

export function useSettings() {
    return useQuery({ queryKey: keys.settings, queryFn: api.settings.get })
}

// ---- writes
export function useCreateProject() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: api.projects.create,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.projects }),
    })
}

export function useUpdateProject() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: api.projects.update,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.projects }),
    })
}

export function useDeleteProject() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: api.projects.remove,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.projects }),
    })
}

export function useReplyMessage() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: api.messages.reply,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.messages }),
    })
}

export function useSetMessageStatus() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: api.messages.setStatus,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.messages }),
    })
}

export function useUpdateSettings() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: api.settings.update,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.settings }),
    })
}
