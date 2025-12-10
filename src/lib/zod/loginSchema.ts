import { z } from "zod";
import { emailSchema, passwordSchema } from "./user-fields";

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
