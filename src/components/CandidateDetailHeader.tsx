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

function getCandidateDecisionSummary(candidate: Candidate): string {
  switch (candidate.verdict) {
    case 'ПОДХОДИТ':
      return 'Кандидат закрывает ключевые требования и выглядит готовым к следующему этапу';
    case 'ЧАСТИЧНО':
      return 'Есть рабочая база, но остаются пробелы, которые нужно уточнить на интервью';
    case 'НЕ СООТВЕТСТВУЕТ':
      return 'Есть критичные несоответствия по профилю, опыту или стеку';
  }
}

function CandidateDetailHeader({
  backTo,
  candidate,
  isStatusUpdating,
  onStatusChange,
}: CandidateDetailHeaderProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="space-y-5">
        <Link
          to={backTo}
          className="inline-flex cursor-pointer text-sm font-medium text-[#1560BD] transition-colors hover:text-[#0f4a92]"
        >
          Назад к списку
        </Link>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)_280px]">
          <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                Кандидат
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                {candidate.name}
              </h2>
              <p className="text-sm font-medium text-slate-700">
                {candidate.pos_label}
              </p>
            </div>

            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-[0.08em] text-slate-500">
                  Город
                </dt>
                <dd className="mt-1 font-medium text-slate-900">
                  {candidate.city}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-[0.08em] text-slate-500">
                  Общий опыт
                </dt>
                <dd className="mt-1 font-medium text-slate-900">
                  {candidate.total_exp}
                </dd>
              </div>
            </dl>
          </section>

          <section className="space-y-3 rounded-xl border border-slate-200 p-4">
            <div className="flex flex-wrap items-start gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                  Итог оценки
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-700">
                  {getCandidateDecisionSummary(candidate)}
                </p>
              </div>
              <span
                className={[
                  'inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold',
                  getVerdictBadgeClassName(candidate.verdict),
                ].join(' ')}
              >
                {getVerdictLabel(candidate.verdict)}
              </span>
            </div>

            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-[0.08em] text-slate-500">
                  Решение
                </dt>
                <dd className="mt-1 font-medium text-slate-900">
                  {getVerdictLabel(candidate.verdict)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-[0.08em] text-slate-500">
                  Текущий статус
                </dt>
                <dd className="mt-1 font-medium text-slate-900">
                  {getCandidateWorkflowStatusLabel(candidate.status)}
                </dd>
              </div>
            </dl>
          </section>

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
        </div>
      </div>
    </section>
  );
}

export default CandidateDetailHeader;
