'use client';

import { FormEvent, useState } from 'react';
import { TaskPayload } from '@/lib/api';

interface Props {
  onAdd: (payload: TaskPayload) => void;
  isPending: boolean;
}

export default function AddTaskForm({ onAdd, isPending }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd({ title: trimmed, description: description.trim() || undefined });
    setTitle('');
    setDescription('');
  };

  return (
    <form className="card add-task-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="field grow">
          <input
            type="text"
            placeholder="Нове завдання…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <button className="btn" type="submit" disabled={isPending || !title.trim()}>
          {isPending ? 'Додаю…' : 'Додати'}
        </button>
      </div>
      {title.trim() && (
        <div className="field" style={{ marginTop: 10 }}>
          <textarea
            placeholder="Опис (необов'язково)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
        </div>
      )}
    </form>
  );
}
