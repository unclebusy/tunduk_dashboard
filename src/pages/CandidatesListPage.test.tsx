import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import CandidatesListPage from './CandidatesListPage';
import * as candidatesApi from '../services/candidatesApi';
import { mockCandidates } from '../services/candidates';
import { useCandidatesStore } from '../store/useCandidatesStore';

jest.mock('../services/candidatesApi', () => ({
  getCandidates: jest.fn(async () => mockCandidates),
  getCandidateById: jest.fn(),
  setCandidatesMockDataset: jest.fn(),
  updateCandidateStatus: jest.fn(),
}));

function renderCandidatesListPage() {
  return render(
    <MemoryRouter initialEntries={['/candidates']}>
      <Routes>
        <Route path="/candidates" element={<CandidatesListPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('CandidatesListPage', () => {
  beforeEach(() => {
    useCandidatesStore.setState(useCandidatesStore.getInitialState(), true);
    jest.mocked(candidatesApi.getCandidates).mockResolvedValue(mockCandidates);
  });

  afterEach(() => {
    cleanup();
    jest.useRealTimers();
  });

  it('filters the rendered list by verdict', async () => {
    const user = userEvent.setup();

    renderCandidatesListPage();

    expect(
      await screen.findByRole('link', { name: /Петрова Анна Сергеевна/i }),
    ).toBeTruthy();
    expect(
      screen.getByRole('link', { name: /Иванов Иван Иванович/i }),
    ).toBeTruthy();

    await user.selectOptions(
      screen.getByRole('combobox', { name: /решение/i }),
      'ПОДХОДИТ',
    );

    await waitFor(() => {
      expect(
        screen.getByRole('link', { name: /Петрова Анна Сергеевна/i }),
      ).toBeTruthy();
      expect(
        screen.queryByRole('link', { name: /Иванов Иван Иванович/i }),
      ).toBeNull();
    });
  });

  it('applies search only after debounce when typing in the search field', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    renderCandidatesListPage();

    const searchInput = await screen.findByRole('searchbox', {
      name: /поиск по фио/i,
    });

    expect(
      screen.getByRole('link', { name: /Иванов Иван Иванович/i }),
    ).toBeTruthy();
    expect(
      screen.getByRole('link', { name: /Петрова Анна Сергеевна/i }),
    ).toBeTruthy();

    await user.clear(searchInput);
    await user.type(searchInput, 'Анна');

    expect(
      screen.getByRole('link', { name: /Иванов Иван Иванович/i }),
    ).toBeTruthy();

    await waitFor(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(
        screen.getByRole('link', { name: /Петрова Анна Сергеевна/i }),
      ).toBeTruthy();
      expect(
        screen.queryByRole('link', { name: /Иванов Иван Иванович/i }),
      ).toBeNull();
    });
  });
});
