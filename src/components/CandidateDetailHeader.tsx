import { Link } from 'react-router';
import type { Candidate, CandidateWorkflowStatus } from '../types/candidate';
import CandidateDecisionPanel from './CandidateDecisionPanel';
import CandidateSummaryIdentity from './CandidateSummaryIdentity';
import CandidateWorkflowPanel from './CandidateWorkflowPanel';

interface CandidateDetailHeaderProps {
  backTo: string;
  candidate: Candidate;
  isStatusUpdating: boolean;
  onStatusChange: (status: CandidateWorkflowStatus) => void;
}

function CandidateDetailHeader({
  backTo,
  candidate,
  isStatusUpdating,
  onStatusChange,
}: CandidateDetailHeaderProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="space-y-5">
        <Link
          to={backTo}
          className="inline-flex cursor-pointer text-sm font-medium text-[#1560BD] transition-colors hover:text-[#0f4a92]"
        >
          Назад к списку
        </Link>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)_280px]">
          <CandidateSummaryIdentity candidate={candidate} />
          <CandidateDecisionPanel candidate={candidate} />
          <CandidateWorkflowPanel
            candidate={candidate}
            isStatusUpdating={isStatusUpdating}
            onStatusChange={onStatusChange}
          />
        </div>
      </div>
    </section>
  );
}

export default CandidateDetailHeader;
