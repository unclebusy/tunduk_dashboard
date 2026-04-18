import { Link, useLocation } from 'react-router';
import type { Candidate } from '../types/candidate';
import { getCandidateWorkflowStatusLabel } from '../utils/candidateWorkflowStatus';

interface CandidateCardProps {
  candidate: Candidate;
}

function formatCreatedAt(value: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

function CandidateCard({ candidate }: CandidateCardProps) {
  const { search } = useLocation();
  const candidateDetailPath = `/candidates/${candidate.id}${search}`;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <Link
          to={candidateDetailPath}
          className="block space-y-2 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
        >
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              <span className="transition-colors hover:text-slate-700">
                {candidate.name}
              </span>
            </h3>
            <p className="text-sm text-slate-600">{candidate.pos_label}</p>
          </div>

          <dl className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
            <div>
              <dt className="font-medium text-slate-900">City</dt>
              <dd>{candidate.city}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-900">Status</dt>
              <dd>{getCandidateWorkflowStatusLabel(candidate.status)}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-900">Verdict</dt>
              <dd>{candidate.verdict}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-900">Added</dt>
              <dd>{formatCreatedAt(candidate.createdAt)}</dd>
            </div>
          </dl>
        </Link>

        <div className="shrink-0 space-y-3 text-sm text-slate-500">
          <a
            href={`mailto:${candidate.email}`}
            className="block transition-colors hover:text-slate-900"
          >
            {candidate.email}
          </a>
          <Link
            to={candidateDetailPath}
            className="inline-flex rounded-lg border border-slate-200 px-3 py-2 font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}

export default CandidateCard;
