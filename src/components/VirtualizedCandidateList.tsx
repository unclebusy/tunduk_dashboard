import { memo } from 'react';
import { List, type RowComponentProps } from 'react-window';
import type { Candidate } from '../types/candidate';
import CandidateCard from './CandidateCard';

interface CandidateRowProps {
  candidates: Candidate[];
}

const CANDIDATE_ROW_HEIGHT = 176;
const CANDIDATE_ROW_GAP = 12;
const MAX_VISIBLE_ROWS = 6;

function CandidateRow({
  candidates,
  index,
  style,
}: RowComponentProps<CandidateRowProps>) {
  const candidate = candidates[index];

  if (!candidate) {
    return null;
  }

  return (
    <div
      style={{
        ...style,
        top: Number(style.top ?? 0) + CANDIDATE_ROW_GAP / 2,
        height: Number(style.height ?? CANDIDATE_ROW_HEIGHT) - CANDIDATE_ROW_GAP,
        paddingRight: 8,
      }}
    >
      <CandidateCard candidate={candidate} />
    </div>
  );
}

function getListHeight(candidateCount: number): number {
  const visibleRows = Math.min(candidateCount, MAX_VISIBLE_ROWS);

  return visibleRows * CANDIDATE_ROW_HEIGHT;
}

interface VirtualizedCandidateListProps {
  candidates: Candidate[];
}

function VirtualizedCandidateList({
  candidates,
}: VirtualizedCandidateListProps) {
  return (
    <div className="candidate-list-shell rounded-xl border border-slate-200 bg-slate-50/40 p-2 shadow-sm">
      <List
        rowComponent={CandidateRow}
        rowCount={candidates.length}
        rowHeight={CANDIDATE_ROW_HEIGHT}
        rowProps={{ candidates }}
        defaultHeight={getListHeight(candidates.length)}
        style={{ height: getListHeight(candidates.length), width: '100%' }}
        overscanCount={2}
        className="candidate-list-scrollbar"
      />
    </div>
  );
}

export default memo(VirtualizedCandidateList);
