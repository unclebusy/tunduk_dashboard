import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import CandidateDetailContacts from '../components/CandidateDetailContacts';
import CandidateDetailEvaluation from '../components/CandidateDetailEvaluation';
import CandidateDetailHeader from '../components/CandidateDetailHeader';
import CandidateDetailProfile from '../components/CandidateDetailProfile';
import { getCandidateById } from '../services/candidatesApi';
import type { Candidate } from '../types/candidate';

function CandidateDetailPage() {
  const { candidateId } = useParams();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadCandidate() {
      if (!candidateId) {
        setCandidate(null);
        setIsLoading(false);

        return;
      }

      setIsLoading(true);

      try {
        const nextCandidate = await getCandidateById(candidateId);

        if (!isMounted) {
          return;
        }

        setCandidate(nextCandidate);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadCandidate();

    return () => {
      isMounted = false;
    };
  }, [candidateId]);

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">
            Candidate Detail
          </h2>
          <p className="text-sm leading-6 text-slate-600">
            Loading candidate details...
          </p>
        </div>
      </section>
    );
  }

  if (!candidate) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              Candidate Not Found
            </h2>
            <p className="text-sm leading-6 text-slate-600">
              No candidate exists for ID: {candidateId ?? 'unknown'}.
            </p>
          </div>
          <Link
            to="/candidates"
            className="inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
          >
            Back to candidates
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <CandidateDetailHeader candidate={candidate} />
      <CandidateDetailContacts candidate={candidate} />
      <CandidateDetailProfile candidate={candidate} />
      <CandidateDetailEvaluation candidate={candidate} />
    </div>
  );
}

export default CandidateDetailPage;
