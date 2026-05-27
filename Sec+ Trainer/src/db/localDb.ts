import Dexie, { type Table } from 'dexie';
import type { Objective, Topic, Question, Attempt, Session, MasterySnapshot, Resource, MistakeJournalEntry, SyncEvent } from '../types/schemas';
import { DOMAINS, OBJECTIVES, TOPICS, RESOURCES, QUESTIONS } from '../data/seedData';

export interface LocalSyncQueueItem {
  id?: number; // Auto-incrementing primary key
  table_name: string; // e.g. "attempts", "sessions", "mistake_journal"
  record_id: string; // The UUID or key of the record
  action: 'insert' | 'update' | 'delete';
  payload: any; // JSON representation of the changes
  timestamp: string; // ISO string
}

export class SecPlusDatabase extends Dexie {
  domains!: Table<{ id: string; name: string; weight: number }, string>;
  objectives!: Table<Objective, string>;
  topics!: Table<Topic, string>;
  questions!: Table<Question, string>;
  attempts!: Table<Attempt, string>;
  sessions!: Table<Session, string>;
  masterySnapshots!: Table<MasterySnapshot, string>;
  resources!: Table<Resource, string>;
  mistakeJournal!: Table<MistakeJournalEntry, string>;
  syncQueue!: Table<LocalSyncQueueItem, number>;
  syncEvents!: Table<SyncEvent, string>;

  constructor() {
    super('SecPlusTrainerDB');
    
    this.version(1).stores({
      domains: 'id',
      objectives: 'objective_id, domain_id',
      topics: 'topic_id, objective_id, parent_topic_id',
      questions: 'question_id, domain_id, objective_id, *topic_ids',
      attempts: 'attempt_id, session_id, question_id, objective_id, timestamp, user_id, correct',
      sessions: 'session_id, target_id, started_at, user_id',
      masterySnapshots: 'objective_id, score, next_review_at, updated_at, user_id',
      resources: 'resource_id, objective_id, user_id',
      mistakeJournal: 'journal_id, attempt_id, question_id, domain_id, objective_id, user_id',
      syncQueue: '++id, table_name, record_id, action, timestamp',
      syncEvents: 'event_id, timestamp, user_id',
    });

    // Populate seed data on database creation
    this.on('populate', () => {
      this.populateSeedData();
    });
  }

  async populateSeedData() {
    console.log('Seeding initial Sec+ SY0-701 data into IndexedDB...');
    try {
      await this.domains.bulkAdd(DOMAINS);
      await this.objectives.bulkAdd(OBJECTIVES);
      await this.topics.bulkAdd(TOPICS);
      await this.resources.bulkAdd(RESOURCES);
      await this.questions.bulkAdd(QUESTIONS);
      
      // Initialize empty mastery snapshots for each objective
      const initialSnapshots: MasterySnapshot[] = OBJECTIVES.map(obj => ({
        objective_id: obj.objective_id,
        accuracy: 0,
        consistency: 0,
        confidence: 0,
        recency: 0,
        variety: 0,
        speed: 0,
        score: 0,
        label: 'Not Started',
        next_review_at: null,
        updated_at: new Date().toISOString(),
        user_id: null,
      }));
      await this.masterySnapshots.bulkAdd(initialSnapshots);
      console.log('Seeding completed successfully!');
    } catch (error) {
      console.error('Error seeding data into IndexedDB:', error);
    }
  }

  // Helper method to clear user progress data (for testing or reset)
  async resetUserProgress() {
    await this.transaction('rw', [this.attempts, this.sessions, this.masterySnapshots, this.mistakeJournal, this.syncQueue, this.syncEvents], async () => {
      await this.attempts.clear();
      await this.sessions.clear();
      await this.mistakeJournal.clear();
      await this.syncQueue.clear();
      await this.syncEvents.clear();
      
      // Reset mastery snapshots to 'Not Started'
      await this.masterySnapshots.toCollection().modify(snapshot => {
        snapshot.accuracy = 0;
        snapshot.consistency = 0;
        snapshot.confidence = 0;
        snapshot.recency = 0;
        snapshot.variety = 0;
        snapshot.speed = 0;
        snapshot.score = 0;
        snapshot.label = 'Not Started';
        snapshot.next_review_at = null;
        snapshot.updated_at = new Date().toISOString();
        snapshot.user_id = null;
      });
    });
  }
}

export const db = new SecPlusDatabase();
export default db;
