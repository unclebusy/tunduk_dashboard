export type CandidateVerdict = 'ПОДХОДИТ' | 'ЧАСТИЧНО' | 'НЕ ПОДХОДИТ';

export type CandidateWorkflowStatus =
  | 'new'
  | 'review'
  | 'interview'
  | 'offer'
  | 'rejected';

export type CandidateSortField =
  | 'createdAt'
  | 'name'
  | 'verdict'
  | 'status';

export type CandidateCriterionStatus = 'ok' | 'partial' | 'no';

export type CandidateExperienceItem = [
  period: string,
  company: string,
  role: string,
  duration: string,
];

export type CandidateCriterion = [
  status: CandidateCriterionStatus,
  description: string,
];

export interface CandidateFilters {
  search?: string;
  workflowStatuses?: CandidateWorkflowStatus[];
  verdicts?: CandidateVerdict[];
  city?: string;
}

export interface Candidate {
  id: string;
  name: string;
  position: string;
  pos_label: string;
  file: string;
  email: string;
  phone: string;
  city: string;
  tg: string;
  exp: CandidateExperienceItem[];
  total_exp: string;
  stack: string;
  edu: string;
  verdict: CandidateVerdict;
  vc: string;
  criteria: CandidateCriterion[];
  summary: string;
  questions: string[];
  status: CandidateWorkflowStatus;
  createdAt: string;
}
