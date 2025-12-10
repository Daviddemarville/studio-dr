import { z } from "zod";
import { passwordSchema } from "./user-fields";

export const passwordUpdateSchema = z
  .object({
    password: passwordSchema,
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    path: ["confirm"],
    message: "Les mots de passe ne correspondent pas.",
  });
