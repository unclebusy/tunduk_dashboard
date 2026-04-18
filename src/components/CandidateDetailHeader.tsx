import { Link } from 'react-router';
import type { Candidate, CandidateWorkflowStatus } from '../types/candidate';
import {
  getVerdictBadgeClassName,
  getVerdictLabel,
} from './candidateDetailStyles';
import { getCandidateWorkflowStatusLabel } from '../utils/candidateWorkflowStatus';

interface CandidateDetailHeaderProps {
  backTo: string;
  candidate: Candidate;
  isStatusUpdating: boolean;
  onStatusChange: (status: CandidateWorkflowStatus) => void;
}

const workflowStatusOptions: Array<{
  label: string;
  value: CandidateWorkflowStatus;
}> = [
  { label: getCandidateWorkflowStatusLabel('new'), value: 'new' },
  { label: getCandidateWorkflowStatusLabel('review'), value: 'review' },
  { label: getCandidateWorkflowStatusLabel('invited'), value: 'invited' },
  { label: getCandidateWorkflowStatusLabel('rejected'), value: 'rejected' },
];

function CandidateDetailHeader({
  backTo,
  candidate,
  isStatusUpdating,
  onStatusChange,
}: CandidateDetailHeaderProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-4">
        <Link
          to={backTo}
          className="inline-flex cursor-pointer text-sm font-medium text-[#1560BD] transition-colors hover:text-[#0f4a92]"
        >
          Назад к списку
        </Link>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            {candidate.name}
          </h2>
          <p className="text-sm leading-6 text-slate-600">
            {candidate.pos_label}
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
          <dl className="grid gap-4 text-sm text-slate-600 sm:grid-cols-3">
            <div>
              <dt className="font-medium text-slate-900">Город</dt>
              <dd>{candidate.city}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-900">Текущий статус</dt>
              <dd>{getCandidateWorkflowStatusLabel(candidate.status)}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-900">Вердикт</dt>
              <dd>
                <span
                  className={[
                    'inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold',
                    getVerdictBadgeClassName(candidate.verdict),
                  ].join(' ')}
                >
                  {getVerdictLabel(candidate.verdict)}
                </span>
              </dd>
            </div>
          </dl>

          <div>
            <label className="block w-full lg:min-w-56">
              <span className="mb-2 block text-sm font-medium text-slate-900">
                Статус воронки
              </span>
              <div className="relative">
                <select
                  value={candidate.status}
                  disabled={isStatusUpdating}
                  onChange={(event) =>
                    onStatusChange(event.target.value as CandidateWorkflowStatus)
                  }
                  className="block w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 pr-10 text-sm text-slate-700 outline-none transition-colors focus:border-[#1560BD] disabled:cursor-not-allowed disabled:bg-slate-50"
                >
                  {workflowStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
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

            {isStatusUpdating ? (
              <p className="mt-2 text-sm text-slate-500" aria-live="polite">
                Сохранение статуса...
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CandidateDetailHeader;
