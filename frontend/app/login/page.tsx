'use client';

import { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { api, setAuth } from '@/lib/api';
import { AuthResponse, LoginInput } from '@/lib/types';
import ThemeToggle from '@/components/ThemeToggle';

export default function LoginPage() {
  const router = useRouter();

  const mutation = useMutation<AuthResponse, Error, LoginInput>({
    mutationFn: api.login,
    onSuccess: ({ user }) => {
      setAuth(user);
      router.push('/');
    },
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    mutation.mutate({ email, password });
  };

  return (
    <div className="container">
      <ThemeToggle />
      <div className="card auth-card">
        <h1>Вхід</h1>
        <p>Увійдіть, щоб керувати своїми завданнями</p>

        {mutation.isError && <div className="error">{mutation.error.message}</div>}

        <form onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
            />
          </div>
          <div className="field">
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </div>
          <button className="btn btn-block" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Вхід…' : 'Увійти'}
          </button>
        </form>

        <p className="muted mt-8">
          Немає акаунта? <Link href="/register">Зареєструватися</Link>
        </p>
      </div>
    </div>
  );
}
