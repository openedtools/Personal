import { z } from 'zod';

// ==========================================
// 1. Taxonomy & Content Schemas (Read-Only Seed Data)
// ==========================================

export const ObjectiveSchema = z.object({
  objective_id: z.string(),
  domain_id: z.string(),
  title: z.string(),
  weight: z.number(), // e.g. 0.12, 0.28
  tags: z.array(z.string()).default([]),
});

export type Objective = z.infer<typeof ObjectiveSchema>;

export const TopicSchema = z.object({
  topic_id: z.string(),
  objective_id: z.string(),
  parent_topic_id: z.string().nullable(),
  official_path: z.string(), // e.g., "1.2 > Zero Trust > Control Plane"
  title: z.string(),
  tags: z.array(z.string()).default([]),
});

export type Topic = z.infer<typeof TopicSchema>;

export const ChoiceSchema = z.object({
  id: z.string(),
  text: z.string(),
});

export const ExplanationSchema = z.object({
  why_correct: z.string(),
  why_not_others: z.record(z.string(), z.string()), // choiceId -> explanation
});

export const ProvenanceSchema = z.object({
  author_type: z.enum(['original', 'user-authored', 'licensed-reference']),
  source_origin: z.array(z.string()),
  copyright_status: z.string(),
  license_note: z.string(),
  import_policy: z.string(),
});

export const QuestionSchema = z.object({
  question_id: z.string(),
  exam_version: z.string().default('SY0-701'),
  domain_id: z.string(),
  objective_id: z.string(),
  topic_ids: z.array(z.string()).default([]),
  type: z.enum(['scenario_mcq', 'mcq', 'msq', 'pbq']),
  difficulty: z.enum(['easy', 'medium', 'hard', 'unspecified']).default('unspecified'),
  prompt: z.string(),
  choices: z.array(ChoiceSchema),
  correct_answers: z.array(z.string()), // array of choice ids
  explanation: ExplanationSchema,
  tags: z.array(z.string()).default([]),
  estimated_seconds: z.number().default(75),
  provenance: ProvenanceSchema,
  status: z.enum(['active', 'deprecated']).default('active'),
});

export type Question = z.infer<typeof QuestionSchema>;

// ==========================================
// 2. User Activity & Progress Schemas (Synced Data)
// ==========================================

export const AttemptSchema = z.object({
  attempt_id: z.string().uuid(),
  session_id: z.string().uuid(),
  question_id: z.string(),
  objective_id: z.string(),
  timestamp: z.string().datetime(), // ISO string
  correct: z.boolean(),
  selected_answers: z.array(z.string()),
  confidence: z.enum(['low', 'medium', 'high']),
  elapsed_ms: z.number(),
  user_id: z.string().nullable().default(null), // matches auth.users.id when signed in
  updated_at: z.string().datetime().optional(), // used for sync timestamps
});

export type Attempt = z.infer<typeof AttemptSchema>;

export const SessionSchema = z.object({
  session_id: z.string().uuid(),
  mode: z.enum(['domain', 'objective', 'weak_areas', 'due_reviews', 'mixed']),
  target_id: z.string().nullable(), // specific domain_id or objective_id
  started_at: z.string().datetime(),
  ended_at: z.string().datetime().nullable(),
  timed: z.boolean().default(false),
  time_limit_seconds: z.number().nullable().default(null),
  user_id: z.string().nullable().default(null),
  updated_at: z.string().datetime().optional(),
});

export type Session = z.infer<typeof SessionSchema>;

export const MasterySnapshotSchema = z.object({
  objective_id: z.string(),
  accuracy: z.number().min(0).max(1),
  consistency: z.number().min(0).max(1),
  confidence: z.number().min(0).max(1),
  recency: z.number().min(0).max(1),
  variety: z.number().min(0).max(1),
  speed: z.number().min(0).max(1),
  score: z.number().min(0).max(100),
  label: z.enum([
    'Not Started',
    'Exposed',
    'Weak',
    'Developing',
    'Proficient',
    'Exam Ready',
    'Mastered',
  ]),
  next_review_at: z.string().datetime().nullable(),
  updated_at: z.string().datetime(),
  user_id: z.string().nullable().default(null),
});

export type MasterySnapshot = z.infer<typeof MasterySnapshotSchema>;

export const ResourceSchema = z.object({
  resource_id: z.string(),
  objective_id: z.string(),
  type: z.enum(['video', 'article', 'doc', 'practice', 'other']),
  title: z.string(),
  url: z.string().url(),
  license_note: z.string().nullable().default(null),
  user_id: z.string().nullable().default(null), // allow user custom remediation links
  updated_at: z.string().datetime().optional(),
});

export type Resource = z.infer<typeof ResourceSchema>;

export const MistakeJournalEntrySchema = z.object({
  journal_id: z.string().uuid(),
  attempt_id: z.string().uuid(),
  question_id: z.string(),
  domain_id: z.string(),
  objective_id: z.string(),
  mistake_type: z.enum([
    'vocabulary gap',
    'confused similar concepts',
    'missed scenario keyword',
    'chose technically true but not best answer',
    'process/order issue',
    'weak tool/control selection',
    'guessed',
    'other',
  ]),
  user_note: z.string(),
  followup_task: z.string().nullable().default(null),
  created_at: z.string().datetime(),
  user_id: z.string().nullable().default(null),
  updated_at: z.string().datetime().optional(),
});

export type MistakeJournalEntry = z.infer<typeof MistakeJournalEntrySchema>;

// ==========================================
// 3. Sync & Backup Utility Schemas
// ==========================================

export const SyncEventSchema = z.object({
  event_id: z.string().uuid(),
  user_id: z.string(),
  direction: z.enum(['push', 'pull', 'sync']),
  status: z.enum(['success', 'error']),
  records_synced: z.number(),
  timestamp: z.string().datetime(),
  error_message: z.string().nullable().default(null),
});

export type SyncEvent = z.infer<typeof SyncEventSchema>;

export const AppExportSchema = z.object({
  version: z.number().default(1),
  exported_at: z.string().datetime(),
  attempts: z.array(AttemptSchema),
  sessions: z.array(SessionSchema),
  mastery_snapshots: z.array(MasterySnapshotSchema),
  mistake_journal: z.array(MistakeJournalEntrySchema),
  resources: z.array(ResourceSchema),
});

export type AppExport = z.infer<typeof AppExportSchema>;
