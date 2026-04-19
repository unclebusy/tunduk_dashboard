import type { Candidate } from '../types/candidate';
import {
  getDisplayValue,
  getEmailHref,
  getPhoneHref,
  getTelegramHref,
  isFilledValue,
} from '../utils/candidateDisplay';

interface CandidateDetailContactsProps {
  candidate: Candidate;
}

interface ContactItem {
  label: string;
  href?: string;
  value: string;
  isExternal?: boolean;
}

function CandidateDetailContacts({
  candidate,
}: CandidateDetailContactsProps) {
  const phoneHref = getPhoneHref(candidate.phone);
  const telegramHref = getTelegramHref(candidate.tg);
  const emailHref = getEmailHref(candidate.email);
  const hasResumeFile = isFilledValue(candidate.file);
  const contactItems: ContactItem[] = [
    {
      label: 'Телефон',
      href: phoneHref,
      value: getDisplayValue(candidate.phone),
    },
    {
      label: 'Telegram',
      href: telegramHref,
      value: getDisplayValue(candidate.tg),
      isExternal: true,
    },
    {
      label: 'Эл. почта',
      href: emailHref,
      value: getDisplayValue(candidate.email),
    },
  ];

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
            {contactItems.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-slate-200 px-4 py-3"
              >
                <dt className="text-xs font-medium uppercase tracking-[0.08em] text-slate-500">
                  {item.label}
                </dt>
                <dd className="mt-2">
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.isExternal ? '_blank' : undefined}
                      rel={item.isExternal ? 'noreferrer' : undefined}
                      className="font-medium text-slate-900 transition-colors hover:text-[#1560BD] focus:outline-none focus-visible:text-[#1560BD]"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span className="font-medium text-slate-400">
                      {item.value}
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <div className="rounded-xl border border-slate-200 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-slate-500">
              Резюме
            </p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-900">
                  {getDisplayValue(candidate.file, 'Файл не приложен')}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {hasResumeFile
                    ? 'Файл приложен к профилю'
                    : 'В профиле нет файла резюме'}
                </p>
              </div>
              <span
                aria-label={
                  hasResumeFile
                    ? 'Файл резюме приложен'
                    : 'Файл резюме недоступен'
                }
                className={[
                  'whitespace-nowrap rounded-lg border px-3 py-2 text-sm font-medium',
                  hasResumeFile
                    ? 'border-slate-200 text-slate-700'
                    : 'border-slate-200 text-slate-400',
                ].join(' ')}
              >
                {hasResumeFile ? 'Приложен' : 'Недоступен'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CandidateDetailContacts;
