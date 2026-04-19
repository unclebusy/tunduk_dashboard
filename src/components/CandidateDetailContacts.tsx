import type { Candidate } from '../types/candidate';

interface CandidateDetailContactsProps {
  candidate: Candidate;
}

function CandidateDetailContacts({
  candidate,
}: CandidateDetailContactsProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Контакты</h3>
          <p className="mt-1 text-sm text-slate-600">
            Быстрые каналы связи и файл профиля кандидата
          </p>
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_260px]">
          <dl className="grid gap-3 text-sm sm:grid-cols-2 lg:col-span-2">
            <div className="rounded-xl border border-slate-200 px-4 py-3">
              <dt className="text-xs font-medium uppercase tracking-[0.08em] text-slate-500">
                Телефон
              </dt>
              <dd className="mt-2">
                <a
                  href={`tel:${candidate.phone}`}
                  className="font-medium text-slate-900 transition-colors hover:text-[#1560BD]"
                >
                  {candidate.phone}
                </a>
              </dd>
            </div>
            <div className="rounded-xl border border-slate-200 px-4 py-3">
              <dt className="text-xs font-medium uppercase tracking-[0.08em] text-slate-500">
                Telegram
              </dt>
              <dd className="mt-2">
                <a
                  href={`https://t.me/${candidate.tg.replace(/^@/, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-slate-900 transition-colors hover:text-[#1560BD]"
                >
                  {candidate.tg}
                </a>
              </dd>
            </div>
            <div className="rounded-xl border border-slate-200 px-4 py-3">
              <dt className="text-xs font-medium uppercase tracking-[0.08em] text-slate-500">
                Эл. почта
              </dt>
              <dd className="mt-2">
                <a
                  href={`mailto:${candidate.email}`}
                  className="font-medium text-slate-900 transition-colors hover:text-[#1560BD]"
                >
                  {candidate.email}
                </a>
              </dd>
            </div>
          </dl>

          <div className="rounded-xl border border-slate-200 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-slate-500">
              Резюме
            </p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-900">
                  {candidate.file}
                </p>
                <p className="mt-1 text-xs text-slate-500">Файл приложен к профилю</p>
              </div>
              <span className="whitespace-nowrap rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-[#1560BD]">
                Открыть
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CandidateDetailContacts;
