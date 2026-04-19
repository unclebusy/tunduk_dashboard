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
  const updateCandidateStatus = useCandidatesStore(
    (state) => state.updateCandidateStatus,
  );
  const clearStatusUpdateNotification = useCandidatesStore(
    (state) => state.clearStatusUpdateNotification,
  );
  const statusUpdateState = useCandidatesStore((state) =>
    candidateId
      ? state.statusUpdateStateById[candidateId] ?? {
          isUpdating: false,
          notification: null,
        }
      : {
          isUpdating: false,
          notification: null,
        },
  );
  const backToCandidatesPath = `/candidates${search}`;

  useEffect(() => {
    if (!candidateId) {
      return;
    }

    clearStatusUpdateNotification(candidateId);
    void loadCandidateById(candidateId);
  }, [candidateId, clearStatusUpdateNotification, loadCandidateById]);

  useEffect(() => {
    if (!candidateId || !statusUpdateState.notification) {
      return;
    }

    const timeoutId = globalThis.setTimeout(() => {
      clearStatusUpdateNotification(candidateId);
    }, 3000);

    return () => {
      globalThis.clearTimeout(timeoutId);
    };
  }, [
    candidateId,
    clearStatusUpdateNotification,
    statusUpdateState.notification,
  ]);

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
      {statusUpdateState.notification ? (
        <section
          className={[
            'rounded-2xl border p-4 shadow-sm',
            statusUpdateState.notification.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-rose-200 bg-rose-50 text-rose-800',
          ].join(' ')}
          aria-live="polite"
        >
          <p className="text-sm font-medium">
            {statusUpdateState.notification.message}
          </p>
        </section>
      ) : null}

      <CandidateDetailHeader
        backTo={backToCandidatesPath}
        candidate={candidate}
        isStatusUpdating={statusUpdateState.isUpdating}
        onStatusChange={(status) => {
          void updateCandidateStatus(candidate.id, status).catch(() => undefined);
        }}
      />
      <CandidateDetailContacts candidate={candidate} />
      <CandidateDetailProfile candidate={candidate} />
      <CandidateDetailEvaluation candidate={candidate} />
    </div>
  );
}

export default CandidateDetailPage;
