import { useEffect, useState } from 'react';
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
  const queryParams = parseCandidateListQueryParams(searchParams);
  const [searchInputValue, setSearchInputValue] = useState(
    queryParams.search ?? '',
  );
  const debouncedSearchValue = useDebounce(searchInputValue, 300);
  const { currentPage, paginatedCandidates, totalPages, totalVisibleCandidates } =
    getCandidateListViewData(candidates, queryParams);

  function updateQueryParams(
    nextQueryParams: Partial<typeof queryParams>,
    replace = false,
  ) {
    setSearchParams(
      serializeCandidateListQueryParams({
        ...queryParams,
        ...nextQueryParams,
      }),
      { replace },
    );
  }

  function handleVerdictChange(nextVerdict?: CandidateVerdict) {
    updateQueryParams({ verdict: nextVerdict, page: 1 });
  }

  function handleSearchChange(nextSearch: string) {
    updateQueryParams({ search: nextSearch, page: 1 });
  }

  function handleSortChange(nextSort?: CandidateSortField) {
    updateQueryParams({ sort: nextSort, page: 1 });
  }

  function handlePageChange(nextPage: number) {
    updateQueryParams({ page: nextPage });
  }

  useEffect(() => {
    setSearchInputValue(queryParams.search ?? '');
  }, [queryParams.search]);

  useEffect(() => {
    if (debouncedSearchValue === (queryParams.search ?? '')) {
      return;
    }

    handleSearchChange(debouncedSearchValue);
  }, [debouncedSearchValue, queryParams.search]);

  useEffect(() => {
    if (queryParams.page === currentPage) {
      return;
    }

    updateQueryParams({ page: currentPage }, true);
  }, [currentPage, queryParams.page]);

  useEffect(() => {
    void loadCandidates(reloadKey > 0);
  }, [reloadKey]);

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
            className="inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
          >
            Повторить
          </button>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              Список кандидатов
            </h2>
            <p className="text-sm leading-6 text-slate-600">
              Показано {paginatedCandidates.length} из {totalVisibleCandidates}{' '}
              кандидатов.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 lg:min-w-[28rem]">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-900">
                Поиск по ФИО
              </span>
              <input
                type="search"
                value={searchInputValue}
                onChange={(event) => setSearchInputValue(event.target.value)}
                placeholder="Введите полное имя"
                className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition-colors focus:border-slate-400"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-900">
                Вердикт
              </span>
              <select
                value={queryParams.verdict ?? ''}
                onChange={(event) =>
                  handleVerdictChange(
                    event.target.value
                      ? (event.target.value as CandidateVerdict)
                      : undefined,
                  )
                }
                className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition-colors focus:border-slate-400"
              >
                {verdictOptions.map((option) => (
                  <option key={option.value ?? 'all'} value={option.value ?? ''}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-900">
                Сортировка
              </span>
              <select
                value={queryParams.sort ?? ''}
                onChange={(event) =>
                  handleSortChange(
                    event.target.value
                      ? (event.target.value as CandidateSortField)
                      : undefined,
                  )
                }
                className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition-colors focus:border-slate-400"
              >
                {sortOptions.map((option) => (
                  <option key={option.value ?? 'default'} value={option.value ?? ''}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        {totalVisibleCandidates > 0 ? (
          paginatedCandidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm leading-6 text-slate-600 shadow-sm">
            По текущим фильтрам кандидаты не найдены.
          </div>
        )}
      </section>

      {totalVisibleCandidates > CANDIDATES_PAGE_SIZE ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              Страница {currentPage} из {totalPages}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Назад
              </button>

              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
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
