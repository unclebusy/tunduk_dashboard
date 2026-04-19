import type { Candidate } from '../types/candidate';
import {
  getCriterionBadgeClassName,
  getCriterionLabel,
} from './candidateDetailStyles';

interface CandidateDetailEvaluationProps {
  candidate: Candidate;
}

function splitCriterionDescription(description: string): {
  title: string;
  evidence: string;
} {
  const [title, evidence] = description.split(' - ').map((item) => item.trim());

  return {
    title: title || description,
    evidence: evidence || 'Нужно уточнение на интервью',
  };
}

function getSortedCriteria(candidate: Candidate): Candidate['criteria'] {
  const order = { no: 0, partial: 1, ok: 2 } as const;

  return [...candidate.criteria].sort(
    ([leftStatus], [rightStatus]) => order[leftStatus] - order[rightStatus],
  );
}

function CandidateDetailEvaluation({
  candidate,
}: CandidateDetailEvaluationProps) {
  const sortedCriteria = getSortedCriteria(candidate);
  const criteriaSummary = candidate.criteria.reduce(
    (accumulator, [status]) => {
      accumulator[status] += 1;
      return accumulator;
    },
    { no: 0, ok: 0, partial: 0 },
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Критерии оценки
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Оценка кандидата по ключевым критериям
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-slate-500">
                Закрыто
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {criteriaSummary.ok}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-slate-500">
                Нужно уточнить
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {criteriaSummary.partial}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-slate-500">
                Критичные пробелы
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {criteriaSummary.no}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {sortedCriteria.map(([status, description]) => {
              const { title, evidence } = splitCriterionDescription(description);

              return (
                <article
                  key={`${status}-${description}`}
                  className="rounded-xl border border-slate-200 px-4 py-3"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900">
                        {title}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {evidence}
                      </p>
                    </div>
                    <span
                      className={[
                        'inline-flex w-fit rounded-full border px-2.5 py-1 text-xs font-semibold',
                        getCriterionBadgeClassName(status),
                      ].join(' ')}
                    >
                      {getCriterionLabel(status)}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Вопросы на интервью
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Вопросы для уточнения пробелов и подтверждения сильных сторон
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            {criteriaSummary.no > 0 ? (
              <span>
                Ключевой фокус: проверить {criteriaSummary.no} критичных
                несоответствия и уточнить {criteriaSummary.partial}{' '}
                пограничных критерия
              </span>
            ) : (
              <span>
                Ключевой фокус: подтвердить сильные стороны и уточнить
                пограничные критерии
              </span>
            )}
          </div>

          <ol className="space-y-2">
            {candidate.questions.map((question, index) => (
              <li
                key={question}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 text-slate-700"
              >
                <div className="flex gap-3">
                  <span className="font-semibold text-slate-900">
                    {index + 1}.
                  </span>
                  <span>{question}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}

export default CandidateDetailEvaluation;
