import { z } from "zod";

export const scanFormSchema = z.object({
  ticker: z
    .string()
    .min(1, "Ticker is required")
    .max(10, "Ticker must be 10 characters or less")
    .regex(/^[A-Z]+$/, "Ticker must contain only uppercase letters")
    .transform((val) => val.toUpperCase()),
  expiry: z.string().optional(),
});

export type ScanFormData = z.infer<typeof scanFormSchema>;

export const filterSchema = z.object({
  minDTE: z.number().min(0).max(365),
  maxDTE: z.number().min(0).max(365),
  minCredit: z.number().min(0),
  minScore: z.number().min(0).max(100),
});

export type FilterFormData = z.infer<typeof filterSchema>;