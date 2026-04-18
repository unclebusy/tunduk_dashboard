import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import CandidateCard from '../components/CandidateCard';
import { useDebounce } from '../hooks/useDebounce';
import type { CandidateSortField, CandidateVerdict } from '../types/candidate';
import { useCandidatesStore } from '../store/useCandidatesStore';
import {
  getCandidateListViewData,
  CANDIDATES_PAGE_SIZE,
} from '../utils/candidateListView';
import {
  parseCandidateListQueryParams,
  serializeCandidateListQueryParams,
} from '../utils/candidateListQueryParams';

const verdictOptions: Array<{
  label: string;
  value?: CandidateVerdict;
}> = [
  { label: 'Все вердикты' },
  { label: 'Подходит', value: 'ПОДХОДИТ' },
  { label: 'Частично', value: 'ЧАСТИЧНО' },
  { label: 'Не подходит', value: 'НЕ СООТВЕТСТВУЕТ' },
];

const sortOptions: Array<{
  label: string;
  value?: CandidateSortField;
}> = [
  { label: 'По умолчанию' },
  { label: 'По имени', value: 'name' },
  { label: 'По опыту', value: 'totalExp' },
  { label: 'По дате добавления', value: 'createdAt' },
];

function CandidatesListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [reloadKey, setReloadKey] = useState(0);
  const candidates = useCandidatesStore((state) => state.candidates);
  const isLoading = useCandidatesStore((state) => state.isCandidatesLoading);
  const errorMessage = useCandidatesStore((state) => state.candidatesError);
  const loadCandidates = useCandidatesStore((state) => state.loadCandidates);
  const queryParams = useMemo(
    () => parseCandidateListQueryParams(searchParams),
    [searchParams],
  );
  const [searchInputValue, setSearchInputValue] = useState(
    queryParams.search ?? '',
  );
  const debouncedSearchValue = useDebounce(searchInputValue, 300);
  const { currentPage, paginatedCandidates, totalPages, totalVisibleCandidates } =
    useMemo(
      () => getCandidateListViewData(candidates, queryParams),
      [candidates, queryParams],
    );

  const updateQueryParams = useCallback((
    nextQueryParams: Partial<typeof queryParams>,
    replace = false,
  ) => {
    setSearchParams(
      serializeCandidateListQueryParams({
        ...queryParams,
        ...nextQueryParams,
      }),
      { replace },
    );
  }, [queryParams, setSearchParams]);

  const handleVerdictChange = useCallback((nextVerdict?: CandidateVerdict) => {
    updateQueryParams({ verdict: nextVerdict, page: 1 });
  }, [updateQueryParams]);

  const handleSearchChange = useCallback((nextSearch: string) => {
    updateQueryParams({ search: nextSearch, page: 1 });
  }, [updateQueryParams]);

  const handleSortChange = useCallback((nextSort?: CandidateSortField) => {
    updateQueryParams({ sort: nextSort, page: 1 });
  }, [updateQueryParams]);

  const handlePageChange = useCallback((nextPage: number) => {
    updateQueryParams({ page: nextPage });
  }, [updateQueryParams]);

  const handleResetFilters = useCallback(() => {
    setSearchInputValue('');
    setSearchParams(
      serializeCandidateListQueryParams({
        page: 1,
      }),
    );
  }, [setSearchParams]);

  const hasActiveFilters =
    Boolean(queryParams.search) ||
    Boolean(queryParams.verdict) ||
    Boolean(queryParams.sort) ||
    queryParams.page > 1;
  const activeFiltersCount = [
    queryParams.search,
    queryParams.verdict,
    queryParams.sort,
    queryParams.page > 1 ? String(queryParams.page) : undefined,
  ].filter(Boolean).length;

  useEffect(() => {
    setSearchInputValue(queryParams.search ?? '');
  }, [queryParams.search]);

  useEffect(() => {
    if (debouncedSearchValue === (queryParams.search ?? '')) {
      return;
    }

    handleSearchChange(debouncedSearchValue);
  }, [debouncedSearchValue, handleSearchChange, queryParams.search]);

  useEffect(() => {
    if (queryParams.page === currentPage) {
      return;
    }

    updateQueryParams({ page: currentPage }, true);
  }, [currentPage, queryParams.page, updateQueryParams]);

  useEffect(() => {
    void loadCandidates(reloadKey > 0);
  }, [loadCandidates, reloadKey]);

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">
            Список кандидатов
          </h2>
          <p className="text-sm leading-6 text-slate-600">
            Загрузка кандидатов...
          </p>
        </div>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              Список кандидатов
            </h2>
            <p className="text-sm leading-6 text-red-700">{errorMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => setReloadKey((currentValue) => currentValue + 1)}
            className="inline-flex cursor-pointer rounded-lg bg-[#1560BD] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0f4a92]"
          >
            Повторить
          </button>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="min-w-0 space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
              Список кандидатов
            </p>
            <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
              <p className="text-xl font-semibold text-slate-900">
                {totalVisibleCandidates} кандидатов
              </p>
              <p className="text-sm text-slate-500">
                Страница {currentPage} из {totalPages}
              </p>
              {hasActiveFilters ? (
                <p className="text-sm font-medium text-slate-500">
                  Активных фильтров: {activeFiltersCount}
                </p>
              ) : null}
            </div>
            <p className="text-sm text-slate-500">
              На текущей странице показано {paginatedCandidates.length}
            </p>
          </div>

          <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3 lg:min-w-[42rem] lg:grid-cols-[minmax(0,1fr)_11rem_11rem_auto]">
            <label className="block min-w-0">
              <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                Поиск по ФИО
              </span>
              <input
                type="search"
                value={searchInputValue}
                onChange={(event) => setSearchInputValue(event.target.value)}
                placeholder="Введите полное имя"
                className="block h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#1560BD]"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                Вердикт
              </span>
              <div className="relative">
                <select
                  value={queryParams.verdict ?? ''}
                  onChange={(event) =>
                    handleVerdictChange(
                      event.target.value
                        ? (event.target.value as CandidateVerdict)
                        : undefined,
                    )
                  }
                  className="block h-10 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-10 text-sm text-slate-700 outline-none transition-colors focus:border-[#1560BD]"
                >
                  {verdictOptions.map((option) => (
                    <option key={option.value ?? 'all'} value={option.value ?? ''}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    aria-hidden="true"
                    className="h-4 w-4"
                  >
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                Сортировка
              </span>
              <div className="relative">
                <select
                  value={queryParams.sort ?? ''}
                  onChange={(event) =>
                    handleSortChange(
                      event.target.value
                        ? (event.target.value as CandidateSortField)
                        : undefined,
                    )
                  }
                  className="block h-10 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-10 text-sm text-slate-700 outline-none transition-colors focus:border-[#1560BD]"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value ?? 'default'} value={option.value ?? ''}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    aria-hidden="true"
                    className="h-4 w-4"
                  >
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </label>

            <div className="flex items-end lg:justify-end">
              <button
                type="button"
                onClick={handleResetFilters}
                disabled={!hasActiveFilters}
                className="inline-flex h-10 cursor-pointer items-center rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Сбросить
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        {totalVisibleCandidates > 0 ? (
          paginatedCandidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm leading-6 text-slate-600 shadow-sm">
            По текущим фильтрам кандидаты не найдены
          </div>
        )}
      </section>

      {totalVisibleCandidates > CANDIDATES_PAGE_SIZE ? (
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              Страница {currentPage} из {totalPages}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="cursor-pointer rounded-lg border border-[#1560BD]/20 px-3 py-2 text-sm font-medium text-[#1560BD] transition-colors hover:bg-[#1560BD]/10 hover:text-[#0f4a92] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Назад
              </button>

              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="cursor-pointer rounded-lg border border-[#1560BD]/20 px-3 py-2 text-sm font-medium text-[#1560BD] transition-colors hover:bg-[#1560BD]/10 hover:text-[#0f4a92] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Далее
              </button>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default CandidatesListPage;
