import { useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router';
import CandidateDetailContacts from '../components/CandidateDetailContacts';
import CandidateDetailEvaluation from '../components/CandidateDetailEvaluation';
import CandidateDetailHeader from '../components/CandidateDetailHeader';
import CandidateDetailProfile from '../components/CandidateDetailProfile';
import { useCandidatesStore } from '../store/useCandidatesStore';

function CandidateDetailPage() {
  const { candidateId } = useParams();
  const { search } = useLocation();
  const candidate = useCandidatesStore((state) =>
    candidateId ? state.candidateDetails[candidateId] ?? null : null,
  );
  const isLoading = useCandidatesStore((state) => state.isCandidateDetailLoading);
  const detailError = useCandidatesStore((state) => state.candidateDetailError);
  const loadCandidateById = useCandidatesStore((state) => state.loadCandidateById);
  const backToCandidatesPath = `/candidates${search}`;

  useEffect(() => {
    if (!candidateId) {
      return;
    }

    void loadCandidateById(candidateId);
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
              {detailError ? 'Failed to Load Candidate' : 'Candidate Not Found'}
            </h2>
            <p className="text-sm leading-6 text-slate-600">
              {detailError ??
                `No candidate exists for ID: ${candidateId ?? 'unknown'}.`}
            </p>
          </div>
          <Link
            to={backToCandidatesPath}
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
      <CandidateDetailHeader backTo={backToCandidatesPath} candidate={candidate} />
      <CandidateDetailContacts candidate={candidate} />
      <CandidateDetailProfile candidate={candidate} />
      <CandidateDetailEvaluation candidate={candidate} />
    </div>
  );
}

export default CandidateDetailPage;
