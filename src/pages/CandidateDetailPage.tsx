import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router';
import CandidateDetailContacts from '../components/CandidateDetailContacts';
import CandidateDetailEvaluation from '../components/CandidateDetailEvaluation';
import CandidateDetailHeader from '../components/CandidateDetailHeader';
import CandidateDetailProfile from '../components/CandidateDetailProfile';
import { useCandidatesStore } from '../store/useCandidatesStore';
import type { CandidateWorkflowStatus } from '../types/candidate';

function CandidateDetailPage() {
  const { candidateId } = useParams();
  const { search } = useLocation();
  const candidate = useCandidatesStore((state) =>
    candidateId ? state.candidateDetails[candidateId] ?? null : null,
  );
  const isLoading = useCandidatesStore((state) => state.isCandidateDetailLoading);
  const detailError = useCandidatesStore((state) => state.candidateDetailError);
  const loadCandidateById = useCandidatesStore((state) => state.loadCandidateById);
  const updateCandidateStatus = useCandidatesStore(
    (state) => state.updateCandidateStatus,
  );
  const backToCandidatesPath = `/candidates${search}`;
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  async function handleStatusChange(status: CandidateWorkflowStatus) {
    if (!candidate || candidate.status === status) {
      return;
    }

    setIsStatusUpdating(true);
    setStatusError(null);

    try {
      await updateCandidateStatus(candidate.id, status);
    } catch (error) {
      setStatusError(
        error instanceof Error
          ? error.message
          : 'Failed to update candidate status.',
      );
    } finally {
      setIsStatusUpdating(false);
    }
  }

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
      <CandidateDetailHeader
        backTo={backToCandidatesPath}
        candidate={candidate}
        isStatusUpdating={isStatusUpdating}
        onStatusChange={handleStatusChange}
        statusError={statusError}
      />
      <CandidateDetailContacts candidate={candidate} />
      <CandidateDetailProfile candidate={candidate} />
      <CandidateDetailEvaluation candidate={candidate} />
    </div>
  );
}

export default CandidateDetailPage;
