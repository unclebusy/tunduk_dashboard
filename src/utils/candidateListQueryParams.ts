import type {
  CandidateListQueryParams,
  CandidateSortField,
  CandidateVerdict,
} from '../types/candidate';

const DEFAULT_PAGE = 1;

const candidateVerdicts: CandidateVerdict[] = [
  'ПОДХОДИТ',
  'ЧАСТИЧНО',
  'НЕ СООТВЕТСТВУЕТ',
];

const candidateSortFields: CandidateSortField[] = [
  'createdAt',
  'name',
  'verdict',
  'status',
];

function isCandidateVerdict(value: string): value is CandidateVerdict {
  return candidateVerdicts.includes(value as CandidateVerdict);
}

function isCandidateSortField(value: string): value is CandidateSortField {
  return candidateSortFields.includes(value as CandidateSortField);
}

function normalizePage(value: string | null): number {
  if (!value) {
    return DEFAULT_PAGE;
  }

  const parsedValue = Number.parseInt(value, 10);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    return DEFAULT_PAGE;
  }

  return parsedValue;
}

function normalizeSearch(value: string | null): string | undefined {
  const normalizedValue = value?.trim();

  return normalizedValue ? normalizedValue : undefined;
}

export function parseCandidateListQueryParams(
  input: URLSearchParams | string,
): CandidateListQueryParams {
  const searchParams =
    typeof input === 'string' ? new URLSearchParams(input) : input;

  const verdictValue = searchParams.get('verdict');
  const sortValue = searchParams.get('sort');

  return {
    verdict:
      verdictValue && isCandidateVerdict(verdictValue)
        ? verdictValue
        : undefined,
    search: normalizeSearch(searchParams.get('search')),
    sort: sortValue && isCandidateSortField(sortValue) ? sortValue : undefined,
    page: normalizePage(searchParams.get('page')),
  };
}

export function serializeCandidateListQueryParams(
  params: Partial<CandidateListQueryParams>,
): URLSearchParams {
  const searchParams = new URLSearchParams();

  if (params.verdict) {
    searchParams.set('verdict', params.verdict);
  }

  if (params.search?.trim()) {
    searchParams.set('search', params.search.trim());
  }

  if (params.sort) {
    searchParams.set('sort', params.sort);
  }

  const page = params.page ?? DEFAULT_PAGE;

  if (page > DEFAULT_PAGE) {
    searchParams.set('page', String(page));
  }

  return searchParams;
}
