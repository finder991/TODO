import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models';
import { signToken, authRequired, AuthRequest } from '../middleware/auth';
import { conflict, unauthorized } from '../utils/httpError';
import { registerSchema, loginSchema } from '../validation/schemas';

const router = Router();

router.post('/register', async (req, res) => {
  const { email, name, password } = registerSchema.parse(req.body);

  if (await User.findOne({ where: { email } })) {
    throw conflict('Користувач з таким email вже існує');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, name, passwordHash });

  const token = signToken(user);
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.status(201).json({ user, token });
});

router.post('/login', async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);

  const user = await User.findOne({ where: { email } });
  if (!user || !(await user.checkPassword(password))) {
    throw unauthorized('Невірний email або пароль');
  }

  const token = signToken(user);
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({ user, token });
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Успішно вийшли з акаунта' });
});

router.get('/me', authRequired, (req: AuthRequest, res) => {
  res.json({ user: req.user });
});

export default router;
