import type { Candidate } from '../types/candidate';
import { getDisplayValue } from '../utils/candidateDisplay';

interface CandidateSummaryIdentityProps {
  candidate: Candidate;
}

function CandidateSummaryIdentity({
  candidate,
}: CandidateSummaryIdentityProps) {
  return (
    <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
          Кандидат
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          {candidate.name}
        </h2>
        <p className="text-sm font-medium text-slate-700">{candidate.pos_label}</p>
      </div>

      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium uppercase tracking-[0.08em] text-slate-500">
            Город
          </dt>
          <dd className="mt-1 font-medium text-slate-900">
            {getDisplayValue(candidate.city)}
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
  );
}

export default CandidateSummaryIdentity;
