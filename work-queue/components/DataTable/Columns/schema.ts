import { z } from 'zod';

export const schema = z.object({
  id: z.string(),
  name: z.string(),
  assignee: z.string().nullable(),
  created: z.string(),
  variables: z.object({
    acquirer_vat: z.object({
      value: z.string()
    }),
    acquirer_name: z.object({
      value: z.string()
    }),
    supplier_vat: z.object({
      value: z.string()
    }),
    supplier_name: z.object({
      value: z.string()
    })
  })
});

export type APIResponseSchema = z.infer<typeof schema>;
