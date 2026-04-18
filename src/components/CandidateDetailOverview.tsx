import type { Candidate } from '../types/candidate';

interface CandidateDetailOverviewProps {
  candidate: Candidate;
}

function CandidateDetailOverview({
  candidate,
}: CandidateDetailOverviewProps) {
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
    </div>
  );
}

export default CandidateDetailOverview;
