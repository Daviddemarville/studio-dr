import { z } from "zod";

/* ----------------------------------------------------------
   FieldSchema — inchangé, on garde exactement ce que tu avais
----------------------------------------------------------- */
export const FieldSchema = z.object({
  type: z.string(),
  name: z.string(),
  label: z.string().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  fields: z.any().optional(), // permet repeater + fields dynamiques
});

/* ----------------------------------------------------------
   TemplateSchema — seulement sécurisation + type automatique
----------------------------------------------------------- */
export const TemplateSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  type: z.string(), // on laisse EXACTEMENT ce que tu avais
  fields: z.array(FieldSchema),
});

/* ----------------------------------------------------------
   ✔ Type TS généré automatiquement depuis ton schema Zod
----------------------------------------------------------- */
export type TemplateSchemaType = z.infer<typeof TemplateSchema>;

/* ----------------------------------------------------------
   ✔ Type des champs (plus pratique dans SectionEditor)
----------------------------------------------------------- */
export type TemplateFieldType = z.infer<typeof FieldSchema>;
