import { z } from "zod";

export const createBoothSchema = z.object({
  eventId: z.uuid(),
  name: z.string().min(1).max(100),
  desc: z.string().max(2000).optional(),
  hidden: z.boolean().optional(),
});

export const updateBoothSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  desc: z.string().max(2000).optional(),
  hidden: z.boolean().optional(),
});
