import { describe, expect, it } from 'vitest';
import { mockCandidates } from '../services/candidates';
import { filterCandidates, getCandidateListViewData } from './candidateListView';

describe('candidateListView', () => {
  it('filters candidates by verdict and full name search together', () => {
    const filteredCandidates = filterCandidates(mockCandidates, {
      verdict: 'ПОДХОДИТ',
      search: 'Анна',
    });

    expect(filteredCandidates).toHaveLength(1);
    expect(filteredCandidates[0]?.id).toBe('petrova');
  });

  it('treats name search as case-insensitive', () => {
    const filteredCandidates = filterCandidates(mockCandidates, {
      search: 'иван',
    });

    expect(filteredCandidates.some(({ id }) => id === 'ivanov')).toBe(true);
  });

  it('returns paginated data and clamps out-of-range pages', () => {
    const viewData = getCandidateListViewData(mockCandidates, {
      page: 999,
      search: undefined,
      sort: undefined,
      verdict: undefined,
    });

    expect(viewData.totalPages).toBe(3);
    expect(viewData.currentPage).toBe(3);
    expect(viewData.paginatedCandidates).toHaveLength(5);
  });

  it('sorts by created date descending before pagination', () => {
    const viewData = getCandidateListViewData(mockCandidates, {
      page: 1,
      search: undefined,
      sort: 'createdAt',
      verdict: undefined,
    });

    expect(viewData.paginatedCandidates[0]?.id).toBe('beishenalieva');
    expect(viewData.paginatedCandidates[1]?.id).toBe('zholboshev');
  });
});
