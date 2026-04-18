import type { Candidate } from '../types/candidate';

interface CandidateDetailProfileProps {
  candidate: Candidate;
}

function CandidateDetailProfile({ candidate }: CandidateDetailProfileProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Summary</h3>
            <p className="mt-1 text-sm text-slate-600">
              High-level candidate overview from the mock profile data.
            </p>
          </div>

          <p className="text-sm leading-7 text-slate-700">{candidate.summary}</p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Stack</h3>
            <p className="mt-1 text-sm text-slate-600">
              Core technologies and tools listed in the candidate profile.
            </p>
          </div>

          <p className="text-sm leading-7 text-slate-700">{candidate.stack}</p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Experience
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Professional background and total hands-on experience.
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
            Total experience: <span className="font-medium">{candidate.total_exp}</span>
          </div>

          <div className="space-y-3">
            {candidate.exp.map(([period, company, role, duration]) => (
              <article
                key={`${company}-${period}-${role}`}
                className="rounded-xl border border-slate-200 p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">
                      {role}
                    </h4>
                    <p className="text-sm text-slate-600">{company}</p>
                  </div>
                  <div className="text-sm text-slate-500 sm:text-right">
                    <p>{period}</p>
                    <p>{duration}</p>
                  </div>
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
              Education
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Education details provided in the candidate profile.
            </p>
          </div>

          <p className="text-sm leading-7 text-slate-700">{candidate.edu}</p>
        </div>
      </section>
    </div>
  );
}

export default CandidateDetailProfile;
