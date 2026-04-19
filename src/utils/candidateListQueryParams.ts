import type {
  CandidateListQueryParams,
  CandidateSortOrder,
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
  'totalExp',
  'verdict',
  'status',
];

const candidateSortOrders: CandidateSortOrder[] = ['asc', 'desc'];

export type CandidateListQueryAction =
  | { type: 'setVerdict'; verdict?: CandidateVerdict }
  | { type: 'setSearch'; search?: string }
  | { type: 'setSort'; sort?: CandidateSortField }
  | { type: 'toggleOrder' }
  | { type: 'setPage'; page: number }
  | { type: 'reset' };

function isCandidateVerdict(value: string): value is CandidateVerdict {
  return candidateVerdicts.includes(value as CandidateVerdict);
}

function isCandidateSortField(value: string): value is CandidateSortField {
  return candidateSortFields.includes(value as CandidateSortField);
}

function isCandidateSortOrder(value: string): value is CandidateSortOrder {
  return candidateSortOrders.includes(value as CandidateSortOrder);
}

export function getDefaultSortOrder(
  sortField?: CandidateSortField,
): CandidateSortOrder | undefined {
  switch (sortField) {
    case 'name':
      return 'asc';
    case 'createdAt':
    case 'totalExp':
    case 'verdict':
    case 'status':
      return 'desc';
    default:
      return undefined;
  }
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
  const sort = sortValue && isCandidateSortField(sortValue) ? sortValue : undefined;
  const orderValue = searchParams.get('order');

  return {
    verdict:
      verdictValue && isCandidateVerdict(verdictValue)
        ? verdictValue
        : undefined,
    search: normalizeSearch(searchParams.get('search')),
    sort,
    order:
      sort && orderValue && isCandidateSortOrder(orderValue)
        ? orderValue
        : getDefaultSortOrder(sort),
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

    const order = params.order ?? getDefaultSortOrder(params.sort);

    if (order) {
      searchParams.set('order', order);
    }
  }

  const page = params.page ?? DEFAULT_PAGE;

  if (page > DEFAULT_PAGE) {
    searchParams.set('page', String(page));
  }

  return searchParams;
}

export function reduceCandidateListQueryParams(
  currentParams: CandidateListQueryParams,
  action: CandidateListQueryAction,
): CandidateListQueryParams {
  switch (action.type) {
    case 'setVerdict':
      return {
        ...currentParams,
        verdict: action.verdict,
        page: DEFAULT_PAGE,
      };
    case 'setSearch':
      return {
        ...currentParams,
        search: normalizeSearch(action.search ?? null),
        page: DEFAULT_PAGE,
      };
    case 'setSort':
      return {
        ...currentParams,
        sort: action.sort,
        order: getDefaultSortOrder(action.sort),
        page: DEFAULT_PAGE,
      };
    case 'toggleOrder':
      if (!currentParams.sort) {
        return currentParams;
      }

      return {
        ...currentParams,
        order: currentParams.order === 'asc' ? 'desc' : 'asc',
        page: DEFAULT_PAGE,
      };
    case 'setPage':
      return {
        ...currentParams,
        page: action.page < DEFAULT_PAGE ? DEFAULT_PAGE : action.page,
      };
    case 'reset':
      return {
        page: DEFAULT_PAGE,
      };
  }
}
