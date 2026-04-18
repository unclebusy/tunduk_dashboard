import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router';
import CandidateDetailContacts from '../components/CandidateDetailContacts';
import CandidateDetailEvaluation from '../components/CandidateDetailEvaluation';
import CandidateDetailHeader from '../components/CandidateDetailHeader';
import CandidateDetailProfile from '../components/CandidateDetailProfile';
import { useCandidatesStore } from '../store/useCandidatesStore';
import type { CandidateWorkflowStatus } from '../types/candidate';

interface StatusNotification {
  message: string;
  type: 'error' | 'success';
}

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
  const [statusNotification, setStatusNotification] =
    useState<StatusNotification | null>(null);

  async function handleStatusChange(status: CandidateWorkflowStatus) {
    if (!candidate || candidate.status === status) {
      return;
    }

    setIsStatusUpdating(true);
    setStatusNotification(null);

    try {
      await updateCandidateStatus(candidate.id, status);
      setStatusNotification({
        message: 'Статус кандидата успешно обновлён',
        type: 'success',
      });
    } catch (error) {
      setStatusNotification({
        message:
          error instanceof Error
            ? error.message
            : 'Не удалось обновить статус кандидата',
        type: 'error',
      });
    } finally {
      setIsStatusUpdating(false);
    }
  }

  useEffect(() => {
    if (!candidateId) {
      return;
    }

    setStatusNotification(null);
    void loadCandidateById(candidateId);
  }, [candidateId, loadCandidateById]);

  if (isLoading && !candidate) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">
            Карточка кандидата
          </h2>
          <p className="text-sm leading-6 text-slate-600">
            Загрузка данных кандидата...
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
              {detailError ? 'Не удалось загрузить кандидата' : 'Кандидат не найден'}
            </h2>
            <p className="text-sm leading-6 text-slate-600">
              {detailError ??
                `Кандидат с ID ${candidateId ?? 'unknown'} не найден`}
            </p>
          </div>
          <Link
            to={backToCandidatesPath}
            className="inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
          >
            Назад к списку
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      {statusNotification ? (
        <section
          className={[
            'rounded-2xl border p-4 shadow-sm',
            statusNotification.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-rose-200 bg-rose-50 text-rose-800',
          ].join(' ')}
          aria-live="polite"
        >
          <p className="text-sm font-medium">{statusNotification.message}</p>
        </section>
      ) : null}

      <CandidateDetailHeader
        backTo={backToCandidatesPath}
        candidate={candidate}
        isStatusUpdating={isStatusUpdating}
        onStatusChange={handleStatusChange}
      />
      <CandidateDetailContacts candidate={candidate} />
      <CandidateDetailProfile candidate={candidate} />
      <CandidateDetailEvaluation candidate={candidate} />
    </div>
  );
}

export default CandidateDetailPage;
