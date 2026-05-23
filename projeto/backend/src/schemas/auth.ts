import { z } from "zod";

export const credentialsSchema = z.object({
  email: z.string().email("Informe um e-mail valido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

export const authEnvSchema = z.object({
  BETTER_AUTH_SECRET: z
    .string()
    .min(32, "BETTER_AUTH_SECRET deve ter pelo menos 32 caracteres."),
  BETTER_AUTH_URL: z.string().url("BETTER_AUTH_URL deve ser uma URL valida."),
});

export type CredentialsInput = z.infer<typeof credentialsSchema>;
export type AuthEnv = z.infer<typeof authEnvSchema>;
