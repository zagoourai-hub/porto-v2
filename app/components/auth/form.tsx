import { Authmode } from "@/app/(auth)/auth/AuthScreen";
import { AuthFormValues, LoginSchema, RegisterSchema } from "@/app/schema/form";
import { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/libs/utils";

interface AuthFormLabels {
    name: string;
    email: string;
    password?: string;
    show: string;
    hide: string;
    submit: readonly string[];
}

interface AuthProps {
    mode: Authmode;
    labels: AuthFormLabels;
    onSubmit: SubmitHandler<AuthFormValues>;
    coldown?: number
    doneSubmit : boolean | false
    redirecting?: boolean;
}

interface FieldConfig {
    name: keyof AuthFormValues;
    label: string;
    type: "text" | "email" | "password";
    autoComplete: string;
    registerOnly?: boolean;
}


const TEXT = {
    processing: "Memproses...",
    tooMany: "Terlalu banyak percobaan",
    doneSubmit: 'Registrasi berhasil',
    redirecting: "Mengarahkan ke dashboard...",
} as const;


const labelCls = "mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-base-content/60";

const AuthForm = ({ labels, mode, onSubmit, coldown = 0, doneSubmit, redirecting }: AuthProps) => {

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const field : FieldConfig[] = [
        {
            name: "name",
            label: labels.name,
            type: "text",
            autoComplete: "name",
            registerOnly: true,
        },
        {
            name: "email",
            label: labels.email,
            type: "email",
            autoComplete: "email",
        },
        {
            name: "password",
            label: labels.password ?? "Password",
            type: "password",
            autoComplete: mode === 1 ? "new-password" : "current-password",
        },
    ];

    const {
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<AuthFormValues>({
        resolver: zodResolver(mode === 1 ? RegisterSchema : LoginSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });



     const busy = isSubmitting || redirecting;
    const locked = busy || coldown > 0 || doneSubmit;
     const showField = field.filter((f) => mode === 1 || !f.registerOnly);


    return (
        <form aria-busy={isSubmitting} onSubmit={handleSubmit(onSubmit)}>
            <fieldset disabled={isSubmitting} className="space-y-4">

            {showField.map((f) => {
                const isPassword = f.type === 'password'

                return (
                    <Controller
                    key={f.name}
                    control={control}
                    name={f.name}
                    render={({field, fieldState}) => (
                        <div className="relative">

                            <label className="block">
                                <span className={cn(labelCls, "mb-1.5 block")}>{f.label}</span>
                                <input
                                    {...field}
                                    value={field.value ?? ""}
                                    type={isPassword && showPassword ? "text" : f.type}
                                    autoComplete={f.autoComplete}
                                    aria-invalid={fieldState.invalid}
                                    className={cn(
                                        "input w-full",
                                        fieldState.invalid && "input-error"
                                    )}
                                />
                            </label>

                            {fieldState.error && (
                                <p
                                    role="alert"
                                    className="mt-1.5 font-mono text-[11px] tracking-wider text-error"
                                >
                                    {fieldState.error.message}
                                </p>
                            )}

                            {isPassword && (
                                <button
                                    type="button"
                                    aria-pressed={showPassword}
                                    onClick={() => setShowPassword((v) => !v)}
                                    className={cn(
                                        labelCls,
                                        "absolute right-0 top-0 hover:text-base-content"
                                    )}
                                >
                                    {showPassword ? labels.hide : labels.show}
                                </button>
                            )}
                        </div>
                    )}
                    />
                )
            })}
            </fieldset>
            <div className="p-10">
                <fieldset disabled={busy || doneSubmit} className="space-y-4">


                <button
                    type="submit"
                    aria-busy={isSubmitting}
                    disabled={locked}
                    className="btn btn-primary w-full"
                >
                    {busy && <span className="loading loading-spinner loading-sm" />}
                    {redirecting
                        ? TEXT.redirecting
                        : isSubmitting
                            ? TEXT.processing
                            : doneSubmit
                                ? TEXT.doneSubmit
                                : coldown > 0
                                    ? `${TEXT.tooMany} (${coldown}s)`
                                    : `${labels.submit[mode]} →`}
                </button>
                </fieldset>
            </div>
        </form>
    );
};

export default AuthForm;
