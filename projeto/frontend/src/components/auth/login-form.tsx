"use client";

import { Eye, EyeOff, Loader2 } from "lucide-react";
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

    try {
      const result = await authClient.signIn.email({
        email: parsed.data.email,
        password: parsed.data.password,
      });

      if (result.error) {
        setError("password", {
          message: "Confira o e-mail e a senha informados.",
        });
        toast.error("Nao foi possivel entrar", {
          description: "Confira o e-mail e a senha informados.",
        });
        return;
      }

      toast.success("Sessao iniciada");
      router.replace("/dashboard");
      router.refresh();
    } catch {
      toast.error("Nao foi possivel entrar", {
        description: "Tente novamente em alguns instantes.",
      });
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2.5">
        <Label className="sr-only" htmlFor="email">
          E-mail
        </Label>
        <div className="relative">
          <Input
            autoComplete="email"
            className="h-13 border-transparent bg-[#5c637a] px-4 text-base text-white shadow-none placeholder:text-[#f2f3f7] focus:border-kwak-blue-500 focus:bg-[#636b83] focus:ring-2 focus:ring-kwak-blue-500/35"
            id="email"
            placeholder="E-mail"
            type="email"
            {...register("email")}
          />
        </div>
        {errors.email ? (
          <p className="text-sm text-red-200">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="space-y-2.5">
        <Label className="sr-only" htmlFor="password">
          Senha
        </Label>
        <div className="relative">
          <Input
            autoComplete="current-password"
            className="h-13 border-transparent bg-[#5c637a] px-4 pr-12 text-base text-white shadow-none placeholder:text-[#f2f3f7] focus:border-kwak-blue-500 focus:bg-[#636b83] focus:ring-2 focus:ring-kwak-blue-500/35"
            id="password"
            placeholder="Senha"
            type={showPassword ? "text" : "password"}
            {...register("password")}
          />
          <Button
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            className="absolute right-1 top-1/2 -translate-y-1/2 text-[#0d3195] hover:bg-white/10 hover:text-[#1f58db]"
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

      <label className="flex cursor-pointer items-center gap-2.5 pt-0.5 text-sm text-[#f4f4f7]">
        <input
          className="h-4 w-4 rounded border-0 bg-[#5c637a] accent-kwak-blue-600 focus:ring-2 focus:ring-kwak-blue-500/50"
          type="checkbox"
        />
        Manter conectado
      </label>

      <Button
        className="mt-8 h-13 w-full rounded-lg bg-[#2146b9] text-base shadow-none hover:bg-[#2a55d3]"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? (
          <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
        ) : null}
        Entrar
      </Button>
    </form>
  );
};
