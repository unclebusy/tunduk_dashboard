import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  createMemoryRouter,
  Navigate,
  RouterProvider,
  useLocation,
  useParams,
} from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import CandidateDetailPage from '../pages/CandidateDetailPage';
import CandidatesListPage from '../pages/CandidatesListPage';
import NotFoundPage from '../pages/NotFoundPage';
import * as candidatesApi from '../services/candidatesApi';
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

function LegacyCandidateDetailRedirect() {
  const { candidateId } = useParams();
  const { search } = useLocation();

  return <Navigate to={`/candidate/${candidateId ?? ''}${search}`} replace />;
}

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
            path: 'candidate/:candidateId',
            element: <CandidateDetailPage />,
          },
          {
            path: 'candidates/:candidateId',
            element: <LegacyCandidateDetailRedirect />,
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
    vi.mocked(candidatesApi.getCandidates).mockResolvedValue(mockCandidates);
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

    expect(router.state.location.pathname).toBe('/candidate/ivanov');
    expect(
      await screen.findByRole('heading', { name: /сильные стороны/i }),
    ).toBeTruthy();
    expect(
      screen.getByRole('combobox', { name: /статус воронки/i }),
    ).toBeTruthy();
  });

  it('shows a not found state for an unknown candidate id', async () => {
    renderCandidateDashboard(['/candidate/unknown-id']);

    expect(
      await screen.findByRole('heading', { name: /кандидат не найден/i }),
    ).toBeTruthy();
    expect(
      screen.getByRole('link', { name: /назад к списку/i }),
    ).toBeTruthy();
  });

  it('shows an empty state when no candidates are returned', async () => {
    vi.mocked(candidatesApi.getCandidates).mockResolvedValue([]);

    renderCandidateDashboard(['/candidates']);

    expect(
      await screen.findByText(/по текущим фильтрам кандидаты не найдены/i),
    ).toBeTruthy();
    expect(screen.getByText(/^Кандидатов:$/i)).toBeTruthy();
    expect(screen.getByText(/^0$/)).toBeTruthy();
  });

  it('shows an error state when candidate loading fails', async () => {
    vi.mocked(candidatesApi.getCandidates).mockRejectedValue(
      new Error('Не удалось загрузить список кандидатов'),
    );

    renderCandidateDashboard(['/candidates']);

    expect(
      await screen.findByText(/не удалось загрузить список кандидатов/i),
    ).toBeTruthy();
    expect(
      screen.getByRole('button', { name: /повторить/i }),
    ).toBeTruthy();
  });

  it('updates candidate status on the detail page and reflects it in the list', async () => {
    const { user } = renderCandidateDashboard(['/candidates']);

    const candidateLink = await screen.findByRole('link', {
      name: /Иванов Иван Иванович/i,
    });

    await user.click(candidateLink);

    const workflowStatusSelect = await screen.findByRole('combobox', {
      name: /статус воронки/i,
    });

    await user.selectOptions(workflowStatusSelect, 'invited');

    expect(
      await screen.findByText(/статус кандидата успешно обновлён/i),
    ).toBeTruthy();
    expect((workflowStatusSelect as HTMLSelectElement).value).toBe('invited');

    await user.click(screen.getByRole('link', { name: /назад к списку/i }));

    const updatedCandidateLink = await screen.findByRole('link', {
      name: /Иванов Иван Иванович/i,
    });
    const candidateCard = updatedCandidateLink.closest('article');

    expect(candidateCard).toBeTruthy();
    expect(within(candidateCard as HTMLElement).getByText('Приглашён')).toBeTruthy();
  });

  it('rolls back the optimistic status when the update request fails', async () => {
    vi.mocked(candidatesApi.updateCandidateStatus).mockRejectedValueOnce(
      new Error('Failed to update candidate status'),
    );

    const { user } = renderCandidateDashboard(['/candidates']);

    const candidateLink = await screen.findByRole('link', {
      name: /Иванов Иван Иванович/i,
    });

    await user.click(candidateLink);

    const workflowStatusSelect = await screen.findByRole('combobox', {
      name: /статус воронки/i,
    });

    await user.selectOptions(workflowStatusSelect, 'review');

    expect(
      await screen.findByText(/failed to update candidate status/i),
    ).toBeTruthy();

    await waitFor(() => {
      expect((workflowStatusSelect as HTMLSelectElement).value).toBe('new');
    });

    await user.click(screen.getByRole('link', { name: /назад к списку/i }));

    const rolledBackCandidateLink = await screen.findByRole('link', {
      name: /Иванов Иван Иванович/i,
    });
    const candidateCard = rolledBackCandidateLink.closest('article');

    expect(candidateCard).toBeTruthy();
    expect(within(candidateCard as HTMLElement).getByText('Новый')).toBeTruthy();
  });
});
