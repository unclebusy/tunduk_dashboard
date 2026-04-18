import candidatesLargeJson from '../../mock/candidates-large.json';
import candidatesJson from '../../mock/candidates.json';
import type {
  Candidate,
  CandidateCriterion,
  CandidateCriterionStatus,
  CandidateExperienceItem,
  CandidateVerdict,
  CandidateWorkflowStatus,
} from '../types/candidate';

type RawCandidateRecord = {
  id: string;
  name: string;
  position: string;
  pos_label: string;
  file: string;
  email: string;
  phone: string;
  city: string;
  tg: string;
  exp: string[][];
  total_exp: string;
  stack: string;
  edu: string;
  verdict: string;
  vc: string;
  criteria: string[][];
  summary: string;
  questions: string[];
  status: string;
  createdAt: string;
};

const verdictMap: Record<CandidateVerdict, CandidateVerdict> = {
  ПОДХОДИТ: 'ПОДХОДИТ',
  ЧАСТИЧНО: 'ЧАСТИЧНО',
  'НЕ СООТВЕТСТВУЕТ': 'НЕ СООТВЕТСТВУЕТ',
};

const workflowStatusMap: Record<CandidateWorkflowStatus, CandidateWorkflowStatus> = {
  new: 'new',
  review: 'review',
  invited: 'invited',
  rejected: 'rejected',
};

const criterionStatusMap: Record<CandidateCriterionStatus, CandidateCriterionStatus> = {
  ok: 'ok',
  partial: 'partial',
  no: 'no',
};

function mapVerdict(verdict: string): CandidateVerdict {
  const mappedVerdict = verdictMap[verdict as CandidateVerdict];

  if (!mappedVerdict) {
    throw new Error(`Unsupported candidate verdict: ${verdict}`);
  }

  return mappedVerdict;
}

function mapWorkflowStatus(status: string): CandidateWorkflowStatus {
  const mappedStatus = workflowStatusMap[status as CandidateWorkflowStatus];

  if (!mappedStatus) {
    throw new Error(`Unsupported candidate workflow status: ${status}`);
  }

  return mappedStatus;
}

function mapExperienceItem(item: string[]): CandidateExperienceItem {
  if (item.length !== 4) {
    throw new Error('Candidate experience item must contain 4 values');
  }

  return [
    item[0] ?? '',
    item[1] ?? '',
    item[2] ?? '',
    item[3] ?? '',
  ];
}

function mapCriterion(item: string[]): CandidateCriterion {
  if (item.length !== 2) {
    throw new Error('Candidate criterion must contain 2 values');
  }

  const status = criterionStatusMap[item[0] as CandidateCriterionStatus];

  if (!status) {
    throw new Error(`Unsupported candidate criterion status: ${item[0]}`);
  }

  return [status, item[1] ?? ''];
}

function mapCandidate(record: RawCandidateRecord): Candidate {
  return {
    ...record,
    verdict: mapVerdict(record.verdict),
    status: mapWorkflowStatus(record.status),
    exp: record.exp.map(mapExperienceItem),
    criteria: record.criteria.map(mapCriterion),
  };
}

export const mockCandidates: Candidate[] = (
  candidatesJson as RawCandidateRecord[]
).map(mapCandidate);

export const mockCandidatesLarge: Candidate[] = (
  candidatesLargeJson as RawCandidateRecord[]
).map(mapCandidate);
