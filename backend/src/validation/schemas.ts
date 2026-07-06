import { z } from 'zod';
import { TASK_STATUSES } from '../models/task';
export const registerSchema = z.object({
  email: z.string().email('Невірний формат email').transform((v) => v.toLowerCase()),
  name: z.string().trim().min(1, 'Ім\'я обов\'язкове').max(100, 'Ім\'я занадто довге'),
  password: z.string().min(8, 'Пароль має містити щонайменше 8 символів').max(100),
});

export const loginSchema = z.object({
  email: z.string().email('Невірний формат email').transform((v) => v.toLowerCase()),
  password: z.string().min(1, 'Пароль обов\'язковий'),
});

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'Назва обов\'язкова').max(200, 'Назва занадто довга'),
  description: z.string().max(5000, 'Опис занадто довгий').optional().default(''),
  status: z.enum(TASK_STATUSES).optional().default('todo'),
});

export const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1, 'Назва не може бути порожньою').max(200, 'Назва занадто довга'),
    description: z.string().max(5000, 'Опис занадто довгий'),
    status: z.enum(TASK_STATUSES),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Потрібно передати хоча б одне поле для оновлення',
  });

export const taskQuerySchema = z.object({
  status: z.enum(TASK_STATUSES).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskQuery = z.infer<typeof taskQuerySchema>;
