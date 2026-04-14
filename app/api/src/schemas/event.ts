import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  desc: z.string().max(5000).optional(),
  imageUrl: z.url().optional(),
});

export const updateEventSchema = createEventSchema.partial();
