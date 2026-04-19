import type { Candidate } from '../types/candidate';
import { getDisplayValue } from '../utils/candidateDisplay';

interface CandidateDetailProfileProps {
  candidate: Candidate;
}

type SummarySections = {
  strengths: string[];
  gaps: string[];
  potential: string[];
  context: string[];
};

function splitSummaryIntoSections(summary: string): SummarySections {
  const sections: SummarySections = {
    strengths: [],
    gaps: [],
    potential: [],
    context: [],
  };

  summary
    .split('.')
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .forEach((sentence) => {
      const normalizedSentence = sentence.toLowerCase();

      if (
        normalizedSentence.includes('не ') ||
        normalizedSentence.includes('отсутств') ||
        normalizedSentence.includes('огранич')
      ) {
        sections.gaps.push(sentence);
        return;
      }

      if (
        normalizedSentence.includes('готов') ||
        normalizedSentence.includes('потенциал') ||
        normalizedSentence.includes('может быть полез')
      ) {
        sections.potential.push(sentence);
        return;
      }

      if (
        normalizedSentence.includes('опыт') ||
        normalizedSentence.includes('стек') ||
        normalizedSentence.includes('покрыти')
      ) {
        sections.strengths.push(sentence);
        return;
      }

      sections.context.push(sentence);
    });

  return sections;
}

function getSectionItems(items: string[]): string[] {
  return items.length > 0 ? items : ['Нет явных данных по этому разделу'];
}

function getStackGroups(candidate: Candidate): {
  primary: string[];
  secondary: string[];
  unconfirmed: string[];
} {
  const stackItems = candidate.stack
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  const primary = stackItems.slice(0, 4);
  const secondary = stackItems.slice(4);
  const unconfirmed = candidate.criteria
    .filter(([status]) => status !== 'ok')
    .map(([, description]) => description.split(' - ')[0]?.trim() ?? '')
    .filter(Boolean);

  return { primary, secondary, unconfirmed };
}

function CandidateDetailProfile({ candidate }: CandidateDetailProfileProps) {
  const summarySections = splitSummaryIntoSections(candidate.summary);
  const stackGroups = getStackGroups(candidate);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Summary</h3>
            <p className="mt-1 text-sm text-slate-600">
              Текстовое резюме кандидата и краткая аналитическая выжимка
            </p>
          </div>

          <article className="rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3">
            <h4 className="text-sm font-semibold text-slate-900">Резюме кандидата</h4>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              {candidate.summary}
            </p>
          </article>

          <div className="grid gap-4 sm:grid-cols-2">
            <article className="space-y-2 rounded-xl border border-slate-200 p-4">
              <h4 className="text-sm font-semibold text-slate-900">
                Сильные стороны
              </h4>
              <ul className="space-y-2 text-sm leading-6 text-slate-700">
                {getSectionItems(summarySections.strengths).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
            <article className="space-y-2 rounded-xl border border-slate-200 p-4">
              <h4 className="text-sm font-semibold text-slate-900">
                Пробелы и ограничения
              </h4>
              <ul className="space-y-2 text-sm leading-6 text-slate-700">
                {getSectionItems(summarySections.gaps).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
            <article className="space-y-2 rounded-xl border border-slate-200 p-4">
              <h4 className="text-sm font-semibold text-slate-900">
                Потенциал
              </h4>
              <ul className="space-y-2 text-sm leading-6 text-slate-700">
                {getSectionItems(summarySections.potential).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
            <article className="space-y-2 rounded-xl border border-slate-200 p-4">
              <h4 className="text-sm font-semibold text-slate-900">
                Контекст
              </h4>
              <ul className="space-y-2 text-sm leading-6 text-slate-700">
                {getSectionItems(summarySections.context).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Стек</h3>
            <p className="mt-1 text-sm text-slate-600">
              Подтверждённые технологии и зоны, которые нужно уточнить
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-slate-900">
                Основные технологии
              </h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {stackGroups.primary.map((item) => (
                  <span
                    key={item}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {stackGroups.secondary.length > 0 ? (
              <div>
                <h4 className="text-sm font-semibold text-slate-900">
                  Дополнительно
                </h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {stackGroups.secondary.map((item) => (
                    <span
                      key={item}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {stackGroups.unconfirmed.length > 0 ? (
              <div>
                <h4 className="text-sm font-semibold text-slate-900">
                  Нужно уточнить
                </h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {stackGroups.unconfirmed.map((item) => (
                    <span
                      key={item}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-600"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Опыт работы
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Профессиональный опыт и общий стаж кандидата
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-slate-500">
              Общий опыт
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {candidate.total_exp}
            </p>
          </div>

          <div className="space-y-2">
            {candidate.exp.map(([period, company, role, duration]) => (
              <article
                key={`${company}-${period}-${role}`}
                className="rounded-xl border border-slate-200 px-4 py-3"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-slate-900">
                      {role}
                    </h4>
                    <p className="mt-1 text-sm text-slate-600">{company}</p>
                  </div>
                  <div className="text-sm sm:text-right">
                    <p className="font-medium text-slate-700">{period}</p>
                    <p className="mt-1 text-slate-500">{duration}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Образование
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Базовая справка по образованию
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 text-slate-700">
            {getDisplayValue(candidate.edu)}
          </div>
        </div>
      </section>
    </div>
  );
}

export default CandidateDetailProfile;
