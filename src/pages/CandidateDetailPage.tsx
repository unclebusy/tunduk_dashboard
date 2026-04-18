import { useParams } from 'react-router';

function CandidateDetailPage() {
  const { candidateId } = useParams();

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">
          Candidate Detail
        </h2>
        <p className="text-sm leading-6 text-slate-600">
          Empty page shell for candidate ID: {candidateId ?? 'unknown'}.
        </p>
      </div>
    </section>
  );
}

export default CandidateDetailPage;
