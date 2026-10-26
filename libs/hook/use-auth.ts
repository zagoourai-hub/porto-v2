import { AuthFormValues } from "@/app/schema/form";
import { useMutation } from "@tanstack/react-query";
import { signIn, signUp } from "../auth-client";


export type MessageResponse = {
    message?: string
  
}



export function useLogin() {
    return useMutation({
        mutationFn : async (payload: AuthFormValues) => {
            const {data : res, error} = await signIn.email({
                email : payload.email,
                password : payload.password
            })
            if (error || !res) throw new Error(error?.message  )
                return res as typeof res & MessageResponse
        },
    })
}
export function useRegister() {
    return useMutation({
        mutationFn : async (payload: AuthFormValues) => {
            const {data : res, error} = await signUp.email({
                name : payload.name ?? '',
                email : payload.email,
                password : payload.password
            })
            if (error) throw new Error(error.message)
                return res as typeof res & MessageResponse
        },
    })
}
