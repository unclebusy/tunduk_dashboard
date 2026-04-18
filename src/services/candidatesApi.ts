import { mockCandidates } from './candidates';
import type { Candidate, CandidateWorkflowStatus } from '../types/candidate';

const DEFAULT_NETWORK_DELAY_MS = 400;

export interface UpdateCandidateStatusOptions {
  shouldFail?: boolean;
  delayMs?: number;
}

function cloneCandidate(candidate: Candidate): Candidate {
  return {
    ...candidate,
    exp: candidate.exp.map((item) => [...item]),
    criteria: candidate.criteria.map((item) => [...item]),
    questions: [...candidate.questions],
  };
}

function cloneCandidates(candidates: Candidate[]): Candidate[] {
  return candidates.map(cloneCandidate);
}

function wait(delayMs: number): Promise<void> {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, delayMs);
  });
}

let candidatesDb: Candidate[] = cloneCandidates(mockCandidates);

export async function getCandidates(delayMs = DEFAULT_NETWORK_DELAY_MS): Promise<Candidate[]> {
  await wait(delayMs);

  return cloneCandidates(candidatesDb);
}

export async function getCandidateById(
  candidateId: string,
  delayMs = DEFAULT_NETWORK_DELAY_MS,
): Promise<Candidate | null> {
  await wait(delayMs);

  const candidate = candidatesDb.find(({ id }) => id === candidateId);

  return candidate ? cloneCandidate(candidate) : null;
}

export async function updateCandidateStatus(
  candidateId: string,
  status: CandidateWorkflowStatus,
  options: UpdateCandidateStatusOptions = {},
): Promise<Candidate> {
  const { shouldFail = false, delayMs = DEFAULT_NETWORK_DELAY_MS } = options;

  await wait(delayMs);

  if (shouldFail) {
    throw new Error('Failed to update candidate status');
  }

  const candidateIndex = candidatesDb.findIndex(({ id }) => id === candidateId);

  if (candidateIndex === -1) {
    throw new Error(`Candidate not found: ${candidateId}`);
  }

  const updatedCandidate: Candidate = {
    ...candidatesDb[candidateIndex],
    status,
  };

  candidatesDb = candidatesDb.map((candidate, index) =>
    index === candidateIndex ? updatedCandidate : candidate,
  );

  return cloneCandidate(updatedCandidate);
}
