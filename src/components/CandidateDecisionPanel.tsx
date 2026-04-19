import type { Candidate } from '../types/candidate';
import {
  getVerdictBadgeClassName,
  getVerdictLabel,
} from './candidateDetailStyles';
import {
  getCandidateWorkflowStatusLabel,
  getCandidateWorkflowStatusTextClassName,
} from '../utils/candidateWorkflowStatus';
import { getCandidateDecisionSummary } from '../utils/candidatePresentation';

interface CandidateDecisionPanelProps {
  candidate: Candidate;
}

function CandidateDecisionPanel({ candidate }: CandidateDecisionPanelProps) {
  return (
    <section className="space-y-3 rounded-xl border border-slate-200 p-4">
      <div className="flex flex-wrap items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
            Итог оценки
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-700">
            {getCandidateDecisionSummary(candidate.verdict)}
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
          <dd className="mt-1">
            <span
              className={[
                'inline-flex text-xs font-medium',
                getCandidateWorkflowStatusTextClassName(candidate.status),
              ].join(' ')}
            >
              {getCandidateWorkflowStatusLabel(candidate.status)}
            </span>
          </dd>
        </div>
      </dl>
    </section>
  );
}

export default CandidateDecisionPanel;
