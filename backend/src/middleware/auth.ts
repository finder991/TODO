import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { User } from '../models';
import { unauthorized } from '../utils/httpError';

export interface AuthRequest extends Request {
  user?: User;
}

interface TokenPayload {
  id: number;
  email: string;
}

export function signToken(user: User): string {
  const payload: TokenPayload = { id: user.id, email: user.email };
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn } as jwt.SignOptions);
}

export async function authRequired(req: AuthRequest, _res: Response, next: NextFunction) {
  let token = req.cookies?.token;
  
  if (!token) {
    const [scheme, headerToken] = (req.headers.authorization || '').split(' ');
    if (scheme === 'Bearer') token = headerToken;
  }

  if (!token) {
    return next(unauthorized('Потрібна авторизація'));
  }

  try {
    const { id } = jwt.verify(token, env.jwtSecret) as TokenPayload;
    const user = await User.findByPk(id);
    if (!user) return next(unauthorized('Користувача більше не існує'));
    req.user = user;
    next();
  } catch {
    next(unauthorized('Недійсний або прострочений токен'));
  }
}
