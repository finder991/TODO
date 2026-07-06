'use client';

import { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { api, setAuth } from '@/lib/api';
import { AuthResponse, RegisterInput } from '@/lib/types';
import ThemeToggle from '@/components/ThemeToggle';

export default function RegisterPage() {
  const router = useRouter();

  const mutation = useMutation<AuthResponse, Error, RegisterInput>({
    mutationFn: api.register,
    onSuccess: ({ user }) => {
      setAuth(user);
      router.push('/');
    },
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    mutation.mutate({ name, email, password });
  };

  return (
    <div className="container">
      <ThemeToggle />
      <div className="card auth-card">
        <h1>Реєстрація</h1>
        <p>Створіть акаунт для керування завданнями</p>

        {mutation.isError && <div className="error">{mutation.error.message}</div>}

        <form onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="name">Ім&apos;я</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
            />
          </div>
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
            <label htmlFor="password">Пароль (мін. 8 символів)</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>
          <button className="btn btn-block" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Реєстрація…' : 'Зареєструватися'}
          </button>
        </form>

        <p className="muted mt-8">
          Вже є акаунт? <Link href="/login">Увійти</Link>
        </p>
      </div>
    </div>
  );
}
