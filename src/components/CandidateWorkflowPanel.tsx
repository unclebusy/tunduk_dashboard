import type { Candidate, CandidateWorkflowStatus } from '../types/candidate';
import { getCandidateWorkflowStatusLabel } from '../utils/candidateWorkflowStatus';

interface CandidateWorkflowPanelProps {
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

function CandidateWorkflowPanel({
  candidate,
  isStatusUpdating,
  onStatusChange,
}: CandidateWorkflowPanelProps) {
  return (
    <section className="rounded-xl border border-slate-200 p-4">
      <div className="space-y-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
            Действие
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-700">
            Обновите этап воронки после проверки кандидата
          </p>
        </div>

        <label className="block">
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
          <p className="text-sm text-slate-500" aria-live="polite">
            Сохранение статуса...
          </p>
        ) : null}
      </div>
    </section>
  );
}

export default CandidateWorkflowPanel;
