import { Router } from 'express';
import { Task } from '../models';
import { authRequired, AuthRequest } from '../middleware/auth';
import { notFound } from '../utils/httpError';
import { createTaskSchema, updateTaskSchema, taskQuerySchema } from '../validation/schemas';

const router = Router();

router.use(authRequired);

async function getOwnTask(req: AuthRequest): Promise<Task> {
  const task = await Task.findOne({
    where: { id: Number(req.params.id), userId: req.user!.id },
  });
  if (!task) throw notFound('Завдання не знайдено');
  return task;
}

router.get('/', async (req: AuthRequest, res) => {
  const { status } = taskQuerySchema.parse(req.query);
  const where: { userId: number; status?: string } = { userId: req.user!.id };
  if (status) where.status = status;

  const tasks = await Task.findAll({ where, order: [['createdAt', 'DESC']] });
  res.json({ tasks });
});

router.post('/', async (req: AuthRequest, res) => {
  const data = createTaskSchema.parse(req.body);
  const task = await Task.create({ ...data, userId: req.user!.id });
  res.status(201).json({ task });
});

router.get('/:id', async (req: AuthRequest, res) => {
  res.json({ task: await getOwnTask(req) });
});

router.put('/:id', async (req: AuthRequest, res) => {
  const data = updateTaskSchema.parse(req.body);
  const task = await getOwnTask(req);
  await task.update(data);
  res.json({ task });
});

router.delete('/:id', async (req: AuthRequest, res) => {
  const task = await getOwnTask(req);
  await task.destroy();
  res.status(204).end();
});

export default router;
