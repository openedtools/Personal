import type { Attempt, MasterySnapshot, Question } from '../types/schemas';

export interface SM2State {
  repetitions: number;
  interval: number; // in days
  easeFactor: number;
}

// ==========================================
// 1. Spaced Repetition (SM-2) Implementation
// ==========================================

export function calculateSM2(q: number, currentState: SM2State): SM2State {
  let { repetitions, interval, easeFactor } = currentState;

  if (q < 3) {
    repetitions = 0;
    interval = 1;
    // Decrease ease factor
    easeFactor = Math.max(1.3, easeFactor - 0.2);
  } else {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 3;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
    // Calculate new ease factor
    const factorChange = 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02);
    easeFactor = Math.max(1.3, easeFactor + factorChange);
  }

  // Cap interval at 21 days for exam prep practicality
  if (interval > 21) {
    interval = 21;
  }

  return { repetitions, interval, easeFactor };
}

// Maps session accuracy to SM-2 quality (0 to 5)
export function mapAccuracyToQuality(accuracy: number, confidence: 'low' | 'medium' | 'high' = 'high'): number {
  if (accuracy === 0) return 0;
  if (accuracy >= 0.90) return confidence === 'low' ? 4 : 5;
  if (accuracy >= 0.80) return 4;
  if (accuracy >= 0.70) return 3;
  if (accuracy >= 0.50) return 2;
  return 1;
}

// ==========================================
// 2. Mastery Scoring Engine
// ==========================================

export function calculateConfidenceScore(correct: boolean, confidence: 'low' | 'medium' | 'high'): number {
  if (correct) {
    if (confidence === 'high') return 1.00;
    if (confidence === 'medium') return 0.90;
    return 0.75; // low confidence correct
  } else {
    if (confidence === 'low') return 0.40;
    if (confidence === 'medium') return 0.20;
    return 0.00; // high confidence wrong (bad calibration!)
  }
}

export function computeMasterySnapshot(
  objectiveId: string,
  attempts: Attempt[],
  sessionsGrouped: { startedAt: string; accuracy: number }[], // sessions containing this objective
  questionsInObjective: Question[],
  nextReviewAt: string | null,
  userId: string | null
): MasterySnapshot {
  const now = new Date();
  
  if (attempts.length === 0) {
    return {
      objective_id: objectiveId,
      accuracy: 0,
      consistency: 0,
      confidence: 0,
      recency: 0,
      variety: 0,
      speed: 0,
      score: 0,
      label: 'Not Started',
      next_review_at: null,
      updated_at: now.toISOString(),
      user_id: userId,
    };
  }

  // 1. Accuracy (A): Exponentially decayed correctness over last 10 attempts
  // w_i = (1.2)^i, where newer attempts have higher weight
  const sortedAttempts = [...attempts]
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .slice(-10);
  
  let accuracySum = 0;
  let weightSum = 0;
  sortedAttempts.forEach((att, idx) => {
    const weight = Math.pow(1.2, idx + 1);
    accuracySum += (att.correct ? 1 : 0) * weight;
    weightSum += weight;
  });
  const A = weightSum > 0 ? accuracySum / weightSum : 0;

  // 2. Consistency (C): Fraction of the last 3 sessions (on different days) containing this objective with accuracy >= 80%
  // Sort sessions by date descending
  const sortedSessions = [...sessionsGrouped]
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
  
  const last3Sessions = sortedSessions.slice(0, 3);
  const consistentSessionsCount = last3Sessions.filter(s => s.accuracy >= 0.80).length;
  // Divide by 3 (requires at least 3 sessions to get 100%)
  const C = consistentSessionsCount / 3;

  // 3. Confidence Calibration (F): Average of attempt calibration scores
  const calibrationSum = sortedAttempts.reduce((sum, att) => {
    return sum + calculateConfidenceScore(att.correct, att.confidence);
  }, 0);
  const F = sortedAttempts.length > 0 ? calibrationSum / sortedAttempts.length : 0;

  // 4. Recency (R): 1.0 if not overdue, decays to 0 over 7 days if overdue
  let R = 1.0;
  if (nextReviewAt) {
    const reviewDate = new Date(nextReviewAt);
    if (reviewDate.getTime() < now.getTime()) {
      const overdueMs = now.getTime() - reviewDate.getTime();
      const overdueDays = overdueMs / (1000 * 60 * 60 * 24);
      R = Math.max(0, 1 - overdueDays / 7); // linear decay to 0 over 7 days
    }
  }

  // 5. Variety (V): Distinct formats attempted relative to available formats (MCQ, MSQ, PBQ)
  const attemptedTypes = new Set(attempts.map(att => {
    const q = questionsInObjective.find(qi => qi.question_id === att.question_id);
    return q ? q.type : 'mcq';
  }));
  // Map formats: if attempted >= 2 distinct formats, variety is 100%. If 1, it is 50%.
  const V = attemptedTypes.size >= 2 ? 1.0 : attemptedTypes.size === 1 ? 0.5 : 0;

  // 6. Speed (S): Median elapsed time vs target (cap at 1.0)
  const elapsedSeconds = attempts.map(att => att.elapsed_ms / 1000);
  elapsedSeconds.sort((a, b) => a - b);
  let medianTime = 75; // default target
  if (elapsedSeconds.length > 0) {
    const mid = Math.floor(elapsedSeconds.length / 2);
    medianTime = elapsedSeconds.length % 2 !== 0 ? elapsedSeconds[mid] : (elapsedSeconds[mid - 1] + elapsedSeconds[mid]) / 2;
  }
  const avgTargetTime = questionsInObjective.length > 0 
    ? questionsInObjective.reduce((sum, q) => sum + q.estimated_seconds, 0) / questionsInObjective.length 
    : 75;
  const S = medianTime <= avgTargetTime 
    ? 1.0 
    : Math.max(0, 2 - medianTime / avgTargetTime);

  // Compute Base Mastery Score
  let score = 100 * (
    0.35 * A +
    0.20 * C +
    0.10 * F +
    0.15 * R +
    0.10 * V +
    0.10 * S
  );

  // Gate Conditions for "Mastered" status
  // Get distinct dates of sessions
  const sessionDays = new Set(
    sessionsGrouped.map(s => new Date(s.startedAt).toDateString())
  );
  const distinctDaysCount = sessionDays.size;

  // Calculate days between first and latest session
  let daysSpan = 0;
  if (sessionsGrouped.length >= 2) {
    const times = sessionsGrouped.map(s => new Date(s.startedAt).getTime());
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    daysSpan = (maxTime - minTime) / (1000 * 60 * 60 * 24);
  }

  const meetsMasteredGates = 
    distinctDaysCount >= 3 && // at least 3 sessions on different days
    daysSpan >= 7 &&          // at least 7 days between first and latest session
    A >= 0.90 &&              // recent accuracy >= 90%
    R >= 0.90 &&              // recency >= 90% (not seriously overdue)
    V >= 0.67;                // sufficient format variety (at least 2 formats in practice)

  let label: MasterySnapshot['label'];
  
  if (score >= 95 && meetsMasteredGates) {
    label = 'Mastered';
  } else {
    // If score makes it past 95 but gates are not met, cap at 94 (Exam Ready)
    if (score >= 95) {
      score = 94;
    }

    if (score >= 85) label = 'Exam Ready';
    else if (score >= 70) label = 'Proficient';
    else if (score >= 55) label = 'Developing';
    else if (score >= 35) label = 'Weak';
    else if (score >= 15) label = 'Exposed';
    else label = 'Not Started';
  }

  return {
    objective_id: objectiveId,
    accuracy: Number(A.toFixed(3)),
    consistency: Number(C.toFixed(3)),
    confidence: Number(F.toFixed(3)),
    recency: Number(R.toFixed(3)),
    variety: Number(V.toFixed(3)),
    speed: Number(S.toFixed(3)),
    score: Number(score.toFixed(1)),
    label,
    next_review_at: nextReviewAt,
    updated_at: now.toISOString(),
    user_id: userId,
  };
}

// Compute Domain and Global Readiness Scores
export function calculateReadiness(
  masterySnapshots: MasterySnapshot[],
  domains: { id: string; weight: number }[],
  objectives: { objective_id: string; domain_id: string }[]
) {
  const domainScores: Record<string, number> = {};

  domains.forEach(dom => {
    const domObjs = objectives.filter(o => o.domain_id === dom.id);
    const totalObjs = domObjs.length;
    if (totalObjs === 0) {
      domainScores[dom.id] = 0;
      return;
    }

    // Filter snapshots in this domain
    const snaps = masterySnapshots.filter(s => 
      domObjs.some(o => o.objective_id === s.objective_id)
    );

    const attemptedSnaps = snaps.filter(s => s.score > 0);
    const attemptedCount = attemptedSnaps.length;

    // Compute mean of objective scores (default to 0 if not attempted)
    const sumScores = snaps.reduce((sum, s) => sum + s.score, 0);
    const averageScore = sumScores / totalObjs;

    // Apply Coverage Factor to penalize un-attempted objectives in the domain
    // CoverageFactor = 0.60 + 0.40 * (attempted / total)
    const coverageFactor = 0.60 + 0.40 * (attemptedCount / totalObjs);
    domainScores[dom.id] = Number((averageScore * coverageFactor).toFixed(1));
  });

  // Weighted Overall Readiness Score
  // Weighted Sum of Domain Scores
  let overallReadiness = 0;
  domains.forEach(dom => {
    overallReadiness += (domainScores[dom.id] || 0) * dom.weight;
  });

  return {
    domainScores,
    overallReadiness: Number(overallReadiness.toFixed(1)),
  };
}
