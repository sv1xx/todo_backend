import z from 'zod';

const createTodoSchema = z.object({
  title: z.string().min(1, 'Заголовок обязателен'),
  groupId: z.string().optional(),
});
export type CreateTodoDto = z.infer<typeof createTodoSchema>;
