-- Create todos table for reminders/todo list feature
CREATE TABLE public.todos (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  due_date date NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  priority text NOT NULL DEFAULT 'medium'::text CHECK (priority = ANY (ARRAY['high'::text, 'medium'::text, 'low'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT todos_pkey PRIMARY KEY (id)
);

-- Index for common queries (pending items ordered by due date)
CREATE INDEX idx_todos_completed_due_date ON public.todos (completed, due_date);
