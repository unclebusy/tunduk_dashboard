import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  createMemoryRouter,
  Navigate,
  RouterProvider,
} from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import CandidateDetailPage from '../pages/CandidateDetailPage';
import CandidatesListPage from '../pages/CandidatesListPage';
import NotFoundPage from '../pages/NotFoundPage';
import { mockCandidates } from '../services/candidates';
import { useCandidatesStore } from '../store/useCandidatesStore';

vi.mock('../services/candidatesApi', () => ({
  getCandidates: vi.fn(async () => mockCandidates),
  getCandidateById: vi.fn(async (candidateId: string) => {
    return mockCandidates.find((candidate) => candidate.id === candidateId) ?? null;
  }),
  updateCandidateStatus: vi.fn(async (candidateId: string, status: string) => {
    const candidate = mockCandidates.find((item) => item.id === candidateId);

    if (!candidate) {
      throw new Error(`Candidate not found: ${candidateId}`);
    }

    return {
      ...candidate,
      status,
    };
  }),
}));

function renderCandidateDashboard(initialEntries: string[]) {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <App />,
        children: [
          {
            index: true,
            element: <Navigate to="/candidates" replace />,
          },
          {
            path: 'candidates',
            element: <CandidatesListPage />,
          },
          {
            path: 'candidates/:candidateId',
            element: <CandidateDetailPage />,
          },
          {
            path: '*',
            element: <NotFoundPage />,
          },
        ],
      },
    ],
    { initialEntries },
  );

  return {
    router,
    user: userEvent.setup(),
    ...render(<RouterProvider router={router} />),
  };
}

describe('Candidate Dashboard integration', () => {
  beforeEach(() => {
    useCandidatesStore.setState(useCandidatesStore.getInitialState(), true);
  });

  afterEach(() => {
    cleanup();
  });

  it('navigates from the list page to the candidate detail page', async () => {
    const { router, user } = renderCandidateDashboard(['/candidates']);

    const candidateLink = await screen.findByRole('link', {
      name: /Иванов Иван Иванович/i,
    });

    await user.click(candidateLink);

    expect(router.state.location.pathname).toBe('/candidates/ivanov');
    expect(
      await screen.findByText(
        /Фронтенд-разработчик с опытом React 3\.5 года\./i,
      ),
    ).toBeTruthy();
    expect(
      screen.getByRole('combobox', { name: /статус воронки/i }),
    ).toBeTruthy();
  });

  it('shows a not found state for an unknown candidate id', async () => {
    renderCandidateDashboard(['/candidates/unknown-id']);

    expect(
      await screen.findByRole('heading', { name: /кандидат не найден/i }),
    ).toBeTruthy();
    expect(
      screen.getByRole('link', { name: /назад к списку/i }),
    ).toBeTruthy();
  });
});
