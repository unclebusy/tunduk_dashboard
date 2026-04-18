import type { Candidate } from '../types/candidate';
import {
  getCriterionBadgeClassName,
  getCriterionLabel,
} from './candidateDetailStyles';

interface CandidateDetailEvaluationProps {
  candidate: Candidate;
}

function CandidateDetailEvaluation({
  candidate,
}: CandidateDetailEvaluationProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Критерии оценки
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Оценка кандидата по ключевым критериям.
            </p>
          </div>

          <div className="space-y-3">
            {candidate.criteria.map(([status, description]) => (
              <article
                key={`${status}-${description}`}
                className="rounded-xl border border-slate-200 p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                  <span
                    className={[
                      'inline-flex w-fit rounded-full border px-2.5 py-1 text-xs font-semibold',
                      getCriterionBadgeClassName(status),
                    ].join(' ')}
                  >
                    {getCriterionLabel(status)}
                  </span>
                  <p className="text-sm leading-6 text-slate-700">
                    {description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Вопросы на интервью
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Вопросы для следующего этапа общения с кандидатом.
            </p>
          </div>

          <ol className="space-y-3">
            {candidate.questions.map((question, index) => (
              <li
                key={question}
                className="rounded-xl border border-slate-200 p-4 text-sm leading-6 text-slate-700"
              >
                <span className="mr-2 font-semibold text-slate-900">
                  {index + 1}.
                </span>
                {question}
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}

export default CandidateDetailEvaluation;
