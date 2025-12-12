import { z } from "zod";

/* ----------------------------------------------------------
   Types TS de référence (pour la récursivité)
----------------------------------------------------------- */
export type TemplateFieldType =
  | {
      type: "text" | "textarea" | "number" | "image";
      name: string;
      label?: string;
    }
  | {
      type: "relation";
      name: string;
      label?: string;
      relation_table: string;
    }
  | {
      type: "repeater";
      name: string;
      label?: string;
      min?: number;
      max?: number;
      fields: TemplateFieldType[];
    };

/* ----------------------------------------------------------
   Schémas Zod atomiques
----------------------------------------------------------- */
const SingleFieldSchema = z.object({
  type: z.enum(["text", "textarea", "number", "image"]),
  name: z.string(),
  label: z.string().optional(),
});

const RelationFieldSchema = z.object({
  type: z.literal("relation"),
  name: z.string(),
  label: z.string().optional(),
  relation_table: z.string(),
});

/* ----------------------------------------------------------
   Schéma principal récursif (clé du fix)
----------------------------------------------------------- */
export const FieldSchema: z.ZodType<TemplateFieldType> = z.lazy(() =>
  z.union([
    SingleFieldSchema,
    RelationFieldSchema,
    z.object({
      type: z.literal("repeater"),
      name: z.string(),
      label: z.string().optional(),
      min: z.number().optional(),
      max: z.number().optional(),
      fields: z.array(FieldSchema),
    }),
  ]),
);

/* ----------------------------------------------------------
   TemplateSchema
----------------------------------------------------------- */
export const TemplateSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  type: z.string(),
  fields: z.array(FieldSchema),
});

/* ----------------------------------------------------------
   Types inférés
----------------------------------------------------------- */
export type TemplateSchemaType = z.infer<typeof TemplateSchema>;
