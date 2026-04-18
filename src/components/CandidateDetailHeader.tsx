import { Link } from 'react-router';
import type { Candidate } from '../types/candidate';
import { getVerdictBadgeClassName } from './candidateDetailStyles';

interface CandidateDetailHeaderProps {
  candidate: Candidate;
}

function CandidateDetailHeader({ candidate }: CandidateDetailHeaderProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-4">
        <Link
          to="/candidates"
          className="inline-flex text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
        >
          Back to candidates
        </Link>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            {candidate.name}
          </h2>
          <p className="text-sm leading-6 text-slate-600">
            {candidate.pos_label}
          </p>
        </div>

        <dl className="grid gap-4 text-sm text-slate-600 sm:grid-cols-3">
          <div>
            <dt className="font-medium text-slate-900">City</dt>
            <dd>{candidate.city}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">Status</dt>
            <dd className="capitalize">{candidate.status}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">Verdict</dt>
            <dd>
              <span
                className={[
                  'inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold',
                  getVerdictBadgeClassName(candidate.verdict),
                ].join(' ')}
              >
                {candidate.verdict}
              </span>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

export default CandidateDetailHeader;
