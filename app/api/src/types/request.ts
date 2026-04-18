import { z } from "zod";
import { loginSchema, signupSchema } from "../schemas/auth.js";
import { createEventSchema } from "../schemas/event.js";
import { createBoothSchema } from "../schemas/booth.js";

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type CreateBoothInput = z.infer<typeof createBoothSchema>;
