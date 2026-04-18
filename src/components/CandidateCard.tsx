import { memo } from 'react';
import { Link, useLocation } from 'react-router';
import type { Candidate } from '../types/candidate';
import {
  getVerdictBadgeClassName,
  getVerdictLabel,
} from './candidateDetailStyles';
import {
  getCandidateWorkflowStatusClassName,
  getCandidateWorkflowStatusLabel,
} from '../utils/candidateWorkflowStatus';

interface CandidateCardProps {
  candidate: Candidate;
}

function getStackItems(stack: string): string[] {
  return stack
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatCandidateGrade(position: string): string {
  return position
    .split('-')
    .map((part) =>
      part.length > 0 ? part[0].toUpperCase() + part.slice(1) : part,
    )
    .join(' ');
}

function CandidateCard({ candidate }: CandidateCardProps) {
  const { search } = useLocation();
  const candidateDetailPath = `/candidate/${candidate.id}${search}`;
  const stackItems = getStackItems(candidate.stack);
  const visibleStackItems = stackItems.slice(0, 4);
  const hiddenStackCount = Math.max(0, stackItems.length - visibleStackItems.length);
  const candidateGrade = formatCandidateGrade(candidate.position);

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_14rem_minmax(0,1fr)_auto] lg:items-start">
        <div className="min-w-0 space-y-2">
          <div className="space-y-1">
            <Link
              to={candidateDetailPath}
              className="inline-flex cursor-pointer rounded-md text-base font-semibold text-slate-900 transition-colors hover:text-[#1560BD] focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
            >
              {candidate.name}
            </Link>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              <span className="inline-flex items-baseline gap-1.5 text-slate-500">
                <span>Город:</span>
                <span className="font-medium text-slate-700">{candidate.city}</span>
              </span>
              <span className="inline-flex items-baseline gap-1.5 text-slate-500">
                <span>Грейд:</span>
                <span className="font-medium text-slate-700">{candidateGrade}</span>
              </span>
            </div>
          </div>
        </div>

        <dl className="grid gap-3 text-sm">
          <div className="space-y-1">
            <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
              Решение
            </dt>
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

          <div className="space-y-1">
            <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
              Статус
            </dt>
            <dd>
              <span
                className={[
                  'inline-flex rounded-full border px-2.5 py-1 text-xs font-medium',
                  getCandidateWorkflowStatusClassName(candidate.status),
                ].join(' ')}
              >
                {getCandidateWorkflowStatusLabel(candidate.status)}
              </span>
            </dd>
          </div>
        </dl>

        <dl className="grid gap-3 text-sm">
          <div className="space-y-1">
            <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
              Общий опыт
            </dt>
            <dd className="font-medium text-slate-900">{candidate.total_exp}</dd>
          </div>

          <div className="space-y-1">
            <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
              Основной стек
            </dt>
            <dd className="flex flex-wrap gap-1.5">
              {visibleStackItems.map((stackItem) => (
                <span
                  key={stackItem}
                  className="inline-flex rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600"
                >
                  {stackItem}
                </span>
              ))}
              {hiddenStackCount > 0 ? (
                <span className="inline-flex rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-500">
                  +{hiddenStackCount}
                </span>
              ) : null}
            </dd>
          </div>
        </dl>

        <div className="flex items-start lg:justify-end">
          <Link
            to={candidateDetailPath}
            className="inline-flex cursor-pointer rounded-lg border border-[#1560BD]/20 px-3 py-2 text-sm font-medium text-[#1560BD] transition-colors hover:bg-[#1560BD]/10 hover:text-[#0f4a92]"
          >
            Подробнее
          </Link>
        </div>
      </div>
    </article>
  );
}

export default memo(CandidateCard);
