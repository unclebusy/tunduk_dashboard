import type { Candidate } from '../types/candidate';

interface CandidateDetailContactsProps {
  candidate: Candidate;
}

function CandidateDetailContacts({
  candidate,
}: CandidateDetailContactsProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Контакты</h3>
          <p className="mt-1 text-sm text-slate-600">
            Основные контактные данные кандидата.
          </p>
        </div>

        <dl className="grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
          <div>
            <dt className="font-medium text-slate-900">Эл. почта</dt>
            <dd>
              <a
                href={`mailto:${candidate.email}`}
                className="transition-colors hover:text-slate-900"
              >
                {candidate.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">Телефон</dt>
            <dd>{candidate.phone}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">Telegram</dt>
            <dd>{candidate.tg}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">Файл резюме</dt>
            <dd>{candidate.file}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

export default CandidateDetailContacts;
