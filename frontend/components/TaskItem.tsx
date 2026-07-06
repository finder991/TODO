'use client';

import { useState } from 'react';
import { TaskPayload } from '@/lib/api';
import { Task, TaskStatus, TASK_STATUSES, STATUS_LABELS } from '@/lib/types';
import { PencilIcon, TrashIcon } from './icons';

interface Props {
  task: Task;
  onUpdate: (payload: Partial<TaskPayload>) => void;
  onDelete: () => void;
  isSaving: boolean;
}

export default function TaskItem({ task, onUpdate, onDelete, isSaving }: Props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  const startEdit = () => {
    setTitle(task.title);
    setDescription(task.description);
    setEditing(true);
  };

  const save = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    onUpdate({ title: trimmed, description });
    setEditing(false);
  };

  if (editing) {
    return (
      <div className={`card task ${task.status}`}>
        <div className="task-main">
          <input
            style={{ width: '100%' }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <textarea
            style={{ width: '100%', marginTop: 8 }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
          <div className="edit-actions" style={{ marginTop: 8 }}>
            <button className="btn btn-sm" onClick={save} disabled={isSaving}>
              Зберегти
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => setEditing(false)}>
              Скасувати
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`card task ${task.status}`}>
      <div className="task-main">
        <div className="task-title">{task.title}</div>
        {task.description && <div className="task-description">{task.description}</div>}
        <span className={`badge ${task.status}`}>{STATUS_LABELS[task.status]}</span>
      </div>
      <div className="task-actions">
        <select
          className="status-select"
          value={task.status}
          onChange={(e) => onUpdate({ status: e.target.value as TaskStatus })}
        >
          {TASK_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>
        <button
          className="btn btn-secondary btn-sm icon-btn"
          onClick={startEdit}
          aria-label="Редагувати"
          title="Редагувати"
        >
          <PencilIcon width={16} height={16} />
        </button>
        <button
          className="btn btn-danger btn-sm icon-btn"
          onClick={() => {
            if (confirm('Видалити завдання?')) onDelete();
          }}
          aria-label="Видалити"
          title="Видалити"
        >
          <TrashIcon width={16} height={16} />
        </button>
      </div>
    </div>
  );
}
