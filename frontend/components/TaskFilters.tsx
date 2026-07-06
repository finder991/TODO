'use client';

import { TASK_STATUSES, STATUS_LABELS } from '@/lib/types';
import { TaskFilter } from '@/lib/useTasks';

interface Props {
  value: TaskFilter;
  onChange: (value: TaskFilter) => void;
}

export default function TaskFilters({ value, onChange }: Props) {
  return (
    <div className="filters">
      <button
        className={`filter-btn ${value === '' ? 'active' : ''}`}
        onClick={() => onChange('')}
      >
        Усі
      </button>
      {TASK_STATUSES.map((status) => (
        <button
          key={status}
          className={`filter-btn ${value === status ? 'active' : ''}`}
          onClick={() => onChange(status)}
        >
          {STATUS_LABELS[status]}
        </button>
      ))}
    </div>
  );
}
