import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockCandidates } from '../services/candidates';
import { useCandidatesStore } from './useCandidatesStore';
import * as candidatesApi from '../services/candidatesApi';

vi.mock('../services/candidatesApi', () => ({
  getCandidates: vi.fn(),
  getCandidateById: vi.fn(),
  updateCandidateStatus: vi.fn(),
}));

function createDeferredPromise<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<T>((nextResolve, nextReject) => {
    resolve = nextResolve;
    reject = nextReject;
  });

  return { promise, resolve, reject };
}

describe('useCandidatesStore updateCandidateStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useCandidatesStore.setState(useCandidatesStore.getInitialState(), true);

    useCandidatesStore.setState({
      candidates: mockCandidates,
      candidateDetails: {
        [mockCandidates[0].id]: mockCandidates[0],
      },
    });
  });

  it('applies optimistic status updates immediately and keeps the server result', async () => {
    const candidate = mockCandidates[0];

    vi.mocked(candidatesApi.updateCandidateStatus).mockResolvedValue({
      ...candidate,
      status: 'invited',
    });

    const updatePromise = useCandidatesStore
      .getState()
      .updateCandidateStatus(candidate.id, 'invited');

    expect(
      useCandidatesStore
        .getState()
        .candidates.find((item) => item.id === candidate.id)?.status,
    ).toBe('invited');
    expect(
      useCandidatesStore.getState().candidateDetails[candidate.id]?.status,
    ).toBe('invited');

    await updatePromise;

    expect(
      useCandidatesStore
        .getState()
        .candidates.find((item) => item.id === candidate.id)?.status,
    ).toBe('invited');
    expect(
      useCandidatesStore.getState().candidateDetails[candidate.id]?.status,
    ).toBe('invited');
  });

  it('rolls back to the previous status when the request fails', async () => {
    const candidate = mockCandidates[0];

    vi.mocked(candidatesApi.updateCandidateStatus).mockRejectedValue(
      new Error('Failed to update candidate status'),
    );

    await expect(
      useCandidatesStore.getState().updateCandidateStatus(candidate.id, 'review'),
    ).rejects.toThrow('Failed to update candidate status');

    expect(
      useCandidatesStore
        .getState()
        .candidates.find((item) => item.id === candidate.id)?.status,
    ).toBe(candidate.status);
    expect(
      useCandidatesStore.getState().candidateDetails[candidate.id]?.status,
    ).toBe(candidate.status);
  });

  it('does not let a stale failed request overwrite a newer successful status', async () => {
    const candidate = mockCandidates[0];
    const firstRequest = createDeferredPromise<(typeof mockCandidates)[number]>();
    const secondRequest = createDeferredPromise<(typeof mockCandidates)[number]>();

    vi.mocked(candidatesApi.updateCandidateStatus)
      .mockImplementationOnce(() => firstRequest.promise)
      .mockImplementationOnce(() => secondRequest.promise);

    const firstUpdatePromise = useCandidatesStore
      .getState()
      .updateCandidateStatus(candidate.id, 'review');
    const secondUpdatePromise = useCandidatesStore
      .getState()
      .updateCandidateStatus(candidate.id, 'invited');

    expect(
      useCandidatesStore
        .getState()
        .candidates.find((item) => item.id === candidate.id)?.status,
    ).toBe('invited');

    secondRequest.resolve({
      ...candidate,
      status: 'invited',
    });

    await secondUpdatePromise;

    firstRequest.reject(new Error('Failed to update candidate status'));

    await expect(firstUpdatePromise).rejects.toThrow(
      'Failed to update candidate status',
    );

    expect(
      useCandidatesStore
        .getState()
        .candidates.find((item) => item.id === candidate.id)?.status,
    ).toBe('invited');
    expect(
      useCandidatesStore.getState().candidateDetails[candidate.id]?.status,
    ).toBe('invited');
  });
});
