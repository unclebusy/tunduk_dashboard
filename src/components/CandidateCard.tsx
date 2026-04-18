import { Link, useLocation } from 'react-router';
import type { Candidate } from '../types/candidate';
import {
  getVerdictBadgeClassName,
  getVerdictLabel,
} from './candidateDetailStyles';

interface CandidateCardProps {
  candidate: Candidate;
}

function CandidateCard({ candidate }: CandidateCardProps) {
  const { search } = useLocation();
  const candidateDetailPath = `/candidate/${candidate.id}${search}`;

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
            <p className="text-sm text-slate-600">{candidate.city}</p>
          </div>

          <dl className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
            <div>
              <dt className="font-medium text-slate-900">Общий опыт</dt>
              <dd>{candidate.total_exp}</dd>
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
            <div className="sm:col-span-2">
              <dt className="font-medium text-slate-900">Основной стек</dt>
              <dd className="line-clamp-2">{candidate.stack}</dd>
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
            Подробнее
          </Link>
        </div>
      </div>
    </article>
  );
}

export default CandidateCard;
