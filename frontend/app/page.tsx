'use client';

import { useState } from 'react';
import { STATUS_LABELS } from '@/lib/types';
import { useAuth } from '@/lib/useAuth';
import { TaskFilter, useTasks, useTaskMutations } from '@/lib/useTasks';
import AddTaskForm from '@/components/AddTaskForm';
import TaskFilters from '@/components/TaskFilters';
import TaskItem from '@/components/TaskItem';
import Header from '@/components/Header';

export default function HomePage() {
  const { user, ready } = useAuth();
  const [filter, setFilter] = useState<TaskFilter>('');

  const { data: tasks = [], isLoading, isError } = useTasks(filter, ready);
  const { create, update, remove } = useTaskMutations();

  if (!ready || !user) return null;

  return (
    <div className="container">
      <Header />

      <AddTaskForm onAdd={create.mutate} isPending={create.isPending} />

      <TaskFilters value={filter} onChange={setFilter} />

      {isLoading && <div className="empty">Завантаження…</div>}
      {isError && <div className="error">Не вдалося завантажити завдання</div>}

      {!isLoading && !isError && tasks.length === 0 && (
        <div className="empty">
          {filter
            ? `Немає завдань зі статусом «${STATUS_LABELS[filter]}»`
            : 'Поки що немає завдань. Додайте перше!'}
        </div>
      )}

      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          isSaving={update.isPending}
          onUpdate={(payload) => update.mutate({ id: task.id, ...payload })}
          onDelete={() => remove.mutate(task.id)}
        />
      ))}
    </div>
  );
}
