import { useEffect, useState } from 'react';
import CandidateCard from '../components/CandidateCard';
import { getCandidates } from '../services/candidatesApi';
import type { Candidate } from '../types/candidate';

function CandidatesListPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

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
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">
            Candidates List
          </h2>
          <p className="text-sm leading-6 text-slate-600">
            Showing {candidates.length} candidates from the mock data source.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        {candidates.map((candidate) => (
          <CandidateCard key={candidate.id} candidate={candidate} />
        ))}
      </section>
    </div>
  );
}

export default CandidatesListPage;
