'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, TaskPayload } from './api';
import { Task, TaskStatus } from './types';

export type TaskFilter = TaskStatus | '';

const KEY = 'tasks';

export function useTasks(filter: TaskFilter, enabled: boolean) {
  return useQuery({
    queryKey: [KEY, filter],
    queryFn: async () => (await api.getTasks(filter)).tasks,
    enabled,
  });
}

export function useTaskMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: [KEY] });

  const create = useMutation({
    mutationFn: (payload: TaskPayload) => api.createTask(payload),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, ...payload }: { id: number } & Partial<TaskPayload>) =>
      api.updateTask(id, payload),
    onMutate: async ({ id, ...payload }) => {
      await qc.cancelQueries({ queryKey: [KEY] });
      const previousTasks = qc.getQueryData([KEY, '']);
      qc.setQueriesData({ queryKey: [KEY] }, (old?: Task[]) => {
        if (!old) return old;
        return old.map((t) => (t.id === id ? { ...t, ...payload } as Task : t));
      });
      return { previousTasks };
    },
    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        qc.setQueriesData({ queryKey: [KEY] }, context.previousTasks);
      }
    },
    onSettled: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: number) => api.deleteTask(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: [KEY] });
      const previousTasks = qc.getQueryData([KEY, '']);
      qc.setQueriesData({ queryKey: [KEY] }, (old?: Task[]) => {
        if (!old) return old;
        return old.filter((t) => t.id !== id);
      });
      return { previousTasks };
    },
    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        qc.setQueriesData({ queryKey: [KEY] }, context.previousTasks);
      }
    },
    onSettled: invalidate,
  });

  return { create, update, remove };
}
