import { z } from 'zod';

export const updateTodoSchema = z.object({
  title: z.string().min(1, 'Заголовок обязателен').optional(),
  completed: z.boolean().optional(),
  order: z
    .number()
    .int()
    .min(0, 'Порядок не может быть отрицательным')
    .optional(),
  groupId: z.string().optional(),
});
