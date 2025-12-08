import { z } from "zod";
import { emailSchema, passwordSchema } from "./user-fields";

export const resetRequestSchema = z.object({
  email: emailSchema,
});

export const resetConfirmSchema = z
  .object({
    password: passwordSchema,
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    path: ["confirm"],
    message: "Les mots de passe ne correspondent pas.",
  });
