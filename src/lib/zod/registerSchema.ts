import { z } from "zod";
import {
  emailSchema,
  firstnameSchema,
  lastnameSchema,
  passwordSchema,
  pseudoSchema,
} from "./user-fields";

export const registerSchema = z
  .object({
    firstname: firstnameSchema,
    lastname: lastnameSchema,
    pseudo: pseudoSchema,
    email: emailSchema,
    password: passwordSchema,
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    path: ["confirm"],
    message: "Les mots de passe ne correspondent pas.",
  });
