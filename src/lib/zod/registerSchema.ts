import { z } from "zod";
import {
  firstnameSchema,
  lastnameSchema,
  emailSchema,
  pseudoSchema,
  passwordSchema,
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
