import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import CandidateCard from '../components/CandidateCard';
import { getCandidates } from '../services/candidatesApi';
import type { Candidate, CandidateVerdict } from '../types/candidate';
import {
  parseCandidateListQueryParams,
  serializeCandidateListQueryParams,
} from '../utils/candidateListQueryParams';

const verdictOptions: Array<{
  label: string;
  value?: CandidateVerdict;
}> = [
  { label: 'All verdicts' },
  { label: 'Подходит', value: 'ПОДХОДИТ' },
  { label: 'Частично', value: 'ЧАСТИЧНО' },
  { label: 'Не соответствует', value: 'НЕ СООТВЕТСТВУЕТ' },
];

function CandidatesListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const queryParams = parseCandidateListQueryParams(searchParams);
  const filteredCandidates = queryParams.verdict
    ? candidates.filter(({ verdict }) => verdict === queryParams.verdict)
    : candidates;

  function handleVerdictChange(nextVerdict?: CandidateVerdict) {
    setSearchParams(
      serializeCandidateListQueryParams({
        ...queryParams,
        verdict: nextVerdict,
        page: 1,
      }),
    );
  }

  useEffect(() => {
    let isMounted = true;

    async function loadCandidates() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const nextCandidates = await getCandidates();

        if (!isMounted) {
          return;
        }

        setCandidates(nextCandidates);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Failed to load candidates.',
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadCandidates();

    return () => {
      isMounted = false;
    };
  }, [reloadKey]);

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">
            Candidates List
          </h2>
          <p className="text-sm leading-6 text-slate-600">
            Loading candidates...
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
              Candidates List
            </h2>
            <p className="text-sm leading-6 text-red-700">{errorMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => setReloadKey((currentValue) => currentValue + 1)}
            className="inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
          >
            Try again
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
              Candidates List
            </h2>
            <p className="text-sm leading-6 text-slate-600">
              Showing {filteredCandidates.length} candidates from the mock data
              source.
            </p>
          </div>

          <label className="block max-w-xs">
            <span className="mb-2 block text-sm font-medium text-slate-900">
              Verdict
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
        </div>
      </section>

      <section className="space-y-4">
        {filteredCandidates.length > 0 ? (
          filteredCandidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm leading-6 text-slate-600 shadow-sm">
            No candidates match the selected verdict.
          </div>
        )}
      </section>
    </div>
  );
}

export default CandidatesListPage;
