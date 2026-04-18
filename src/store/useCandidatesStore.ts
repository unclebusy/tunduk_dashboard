import { create } from 'zustand';
import {
  getCandidateById,
  getCandidates,
  type UpdateCandidateStatusOptions,
  updateCandidateStatus,
} from '../services/candidatesApi';
import type { Candidate, CandidateWorkflowStatus } from '../types/candidate';

interface CandidatesStoreState {
  candidates: Candidate[];
  candidateDetails: Record<string, Candidate>;
  isCandidatesLoading: boolean;
  candidatesError: string | null;
  isCandidateDetailLoading: boolean;
  candidateDetailError: string | null;
  hasLoadedCandidates: boolean;
}

interface CandidatesStoreActions {
  loadCandidates: (force?: boolean) => Promise<void>;
  loadCandidateById: (candidateId: string) => Promise<Candidate | null>;
  updateCandidateStatus: (
    candidateId: string,
    status: CandidateWorkflowStatus,
    options?: UpdateCandidateStatusOptions,
  ) => Promise<Candidate>;
}

type CandidatesStore = CandidatesStoreState & CandidatesStoreActions;

function toCandidateDetailsMap(candidates: Candidate[]): Record<string, Candidate> {
  return candidates.reduce<Record<string, Candidate>>((accumulator, candidate) => {
    accumulator[candidate.id] = candidate;

    return accumulator;
  }, {});
}

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

function upsertCandidate(
  candidates: Candidate[],
  nextCandidate: Candidate,
): Candidate[] {
  const hasCandidate = candidates.some(
    (candidate) => candidate.id === nextCandidate.id,
  );

  if (!hasCandidate) {
    return candidates;
  }

  return candidates.map((candidate) =>
    candidate.id === nextCandidate.id ? nextCandidate : candidate,
  );
}

export const useCandidatesStore = create<CandidatesStore>()((set, get) => ({
  candidates: [],
  candidateDetails: {},
  isCandidatesLoading: false,
  candidatesError: null,
  isCandidateDetailLoading: false,
  candidateDetailError: null,
  hasLoadedCandidates: false,

  async loadCandidates(force = false) {
    const { hasLoadedCandidates, isCandidatesLoading } = get();

    if (isCandidatesLoading || (hasLoadedCandidates && !force)) {
      return;
    }

    set({ isCandidatesLoading: true, candidatesError: null });

    try {
      const candidates = await getCandidates();

      set((state) => ({
        candidates,
        candidateDetails: {
          ...state.candidateDetails,
          ...toCandidateDetailsMap(candidates),
        },
        hasLoadedCandidates: true,
        isCandidatesLoading: false,
        candidatesError: null,
      }));
    } catch (error) {
      set({
        isCandidatesLoading: false,
        candidatesError: getErrorMessage(error, 'Failed to load candidates'),
      });
    }
  },

  async loadCandidateById(candidateId: string) {
    if (!candidateId) {
      set({ candidateDetailError: null, isCandidateDetailLoading: false });

      return null;
    }

    set({ isCandidateDetailLoading: true, candidateDetailError: null });

    try {
      const candidate = await getCandidateById(candidateId);

      set((state) => ({
        candidateDetails: candidate
          ? {
              ...state.candidateDetails,
              [candidate.id]: candidate,
            }
          : state.candidateDetails,
        isCandidateDetailLoading: false,
        candidateDetailError: null,
      }));

      return candidate;
    } catch (error) {
      set({
        isCandidateDetailLoading: false,
        candidateDetailError: getErrorMessage(
          error,
          'Failed to load candidate details',
        ),
      });

      return null;
    }
  },

  async updateCandidateStatus(candidateId, status, options) {
    const state = get();
    const existingCandidate =
      state.candidateDetails[candidateId] ??
      state.candidates.find((candidate) => candidate.id === candidateId);

    if (!existingCandidate) {
      throw new Error(`Candidate not found: ${candidateId}`);
    }

    const optimisticCandidate: Candidate = {
      ...existingCandidate,
      status,
    };

    set((currentState) => ({
      candidates: upsertCandidate(currentState.candidates, optimisticCandidate),
      candidateDetails: {
        ...currentState.candidateDetails,
        [optimisticCandidate.id]: optimisticCandidate,
      },
    }));

    try {
      const updatedCandidate = await updateCandidateStatus(
        candidateId,
        status,
        options,
      );

      set((currentState) => ({
        candidates: upsertCandidate(currentState.candidates, updatedCandidate),
        candidateDetails: {
          ...currentState.candidateDetails,
          [updatedCandidate.id]: updatedCandidate,
        },
      }));

      return updatedCandidate;
    } catch (error) {
      set((currentState) => ({
        candidates: upsertCandidate(currentState.candidates, existingCandidate),
        candidateDetails: {
          ...currentState.candidateDetails,
          [existingCandidate.id]: existingCandidate,
        },
      }));

      throw error;
    }
  },
}));
