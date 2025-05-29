import { z } from 'zod';

export const updateGroupSchema = z.object({
  name: z.string().min(1).optional(),
});
