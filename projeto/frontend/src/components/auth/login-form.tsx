"use client";

import { Eye, EyeOff, Loader2, LockKeyhole, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type LoginInput, loginSchema } from "@/schemas/auth";

export const LoginForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    defaultValues: {
      email: "admin@kwakfinance.local",
      password: "admin123",
    },
  });

  const onSubmit = async (values: LoginInput) => {
    const parsed = loginSchema.safeParse(values);

    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0];

        if (field === "email" || field === "password") {
          setError(field, { message: issue.message });
        }
      });
      return;
    }

    const result = await authClient.signIn.email({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (result.error) {
      toast.error("Nao foi possivel entrar", {
        description: "Confira o e-mail e a senha informados.",
      });
      return;
    }

    toast.success("Sessao iniciada");
    router.replace("/dashboard");
    router.refresh();
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <div className="relative">
          <Mail
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-kwak-lavender-400"
          />
          <Input
            autoComplete="email"
            className="pl-10"
            id="email"
            placeholder="admin@kwakfinance.local"
            type="email"
            {...register("email")}
          />
        </div>
        {errors.email ? (
          <p className="text-sm text-red-200">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <div className="relative">
          <LockKeyhole
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-kwak-lavender-400"
          />
          <Input
            autoComplete="current-password"
            className="px-10"
            id="password"
            placeholder="Digite sua senha"
            type={showPassword ? "text" : "password"}
            {...register("password")}
          />
          <Button
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            className="absolute right-1 top-1/2 -translate-y-1/2"
            onClick={() => setShowPassword((current) => !current)}
            size="icon"
            type="button"
            variant="ghost"
          >
            {showPassword ? (
              <EyeOff aria-hidden="true" className="h-4 w-4" />
            ) : (
              <Eye aria-hidden="true" className="h-4 w-4" />
            )}
          </Button>
        </div>
        {errors.password ? (
          <p className="text-sm text-red-200">{errors.password.message}</p>
        ) : null}
      </div>

      <Button className="w-full" disabled={isSubmitting} type="submit">
        {isSubmitting ? (
          <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
        ) : null}
        Entrar
      </Button>
    </form>
  );
};
