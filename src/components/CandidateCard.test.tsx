import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from '@jest/globals';
import CandidateCard from './CandidateCard';
import { mockCandidates } from '../services/candidates';

describe('CandidateCard', () => {
  it('renders the verdict badge with the expected label and color classes', () => {
    render(
      <MemoryRouter>
        <CandidateCard candidate={mockCandidates[1]} />
      </MemoryRouter>,
    );

    const verdictBadge = screen.getByText('Подходит');

    expect(verdictBadge).toBeTruthy();
    expect(verdictBadge.className).toContain('emerald');
  });
});
