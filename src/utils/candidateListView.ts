import type { Candidate, CandidateListQueryParams } from '../types/candidate';

export const CANDIDATES_PAGE_SIZE = 10;

export interface CandidateListViewData {
  currentPage: number;
  paginatedCandidates: Candidate[];
  totalPages: number;
  totalVisibleCandidates: number;
}

function parseTotalExperience(value: string): number {
  const normalizedValue = value.replace(',', '.');
  const parsedValue = Number.parseFloat(normalizedValue.replace(/[^\d.]/g, ''));

  return Number.isNaN(parsedValue) ? 0 : parsedValue;
}

export function sortCandidates(
  candidates: Candidate[],
  sortField: CandidateListQueryParams['sort'],
): Candidate[] {
  if (!sortField) {
    return candidates;
  }

  return [...candidates].sort((leftCandidate, rightCandidate) => {
    switch (sortField) {
      case 'name':
        return leftCandidate.name.localeCompare(rightCandidate.name);
      case 'totalExp':
        return (
          parseTotalExperience(rightCandidate.total_exp) -
          parseTotalExperience(leftCandidate.total_exp)
        );
      case 'verdict':
        return leftCandidate.verdict.localeCompare(rightCandidate.verdict);
      case 'status':
        return leftCandidate.status.localeCompare(rightCandidate.status);
      case 'createdAt':
        return (
          new Date(rightCandidate.createdAt).getTime() -
          new Date(leftCandidate.createdAt).getTime()
        );
    }
  });
}

export function filterCandidates(
  candidates: Candidate[],
  queryParams: Pick<CandidateListQueryParams, 'search' | 'verdict'>,
): Candidate[] {
  return candidates.filter((candidate) => {
    const matchesVerdict = queryParams.verdict
      ? candidate.verdict === queryParams.verdict
      : true;
    const matchesSearch = queryParams.search
      ? candidate.name
          .toLocaleLowerCase()
          .includes(queryParams.search.toLocaleLowerCase())
      : true;

    return matchesVerdict && matchesSearch;
  });
}

export function getCandidateListViewData(
  candidates: Candidate[],
  queryParams: CandidateListQueryParams,
): CandidateListViewData {
  const filteredCandidates = filterCandidates(candidates, queryParams);
  const sortedCandidates = sortCandidates(filteredCandidates, queryParams.sort);
  const totalPages = Math.max(
    1,
    Math.ceil(sortedCandidates.length / CANDIDATES_PAGE_SIZE),
  );
  const currentPage = Math.min(queryParams.page, totalPages);
  const paginatedCandidates = sortedCandidates.slice(
    (currentPage - 1) * CANDIDATES_PAGE_SIZE,
    currentPage * CANDIDATES_PAGE_SIZE,
  );

  return {
    currentPage,
    paginatedCandidates,
    totalPages,
    totalVisibleCandidates: sortedCandidates.length,
  };
}
