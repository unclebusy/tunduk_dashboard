export type CandidateVerdict = 'ПОДХОДИТ' | 'ЧАСТИЧНО' | 'НЕ СООТВЕТСТВУЕТ';

export type CandidateWorkflowStatus =
  | 'new'
  | 'review'
  | 'invited'
  | 'rejected';

export type CandidateSortField =
  | 'createdAt'
  | 'name'
  | 'totalExp'
  | 'verdict'
  | 'status';

export type CandidateSortOrder = 'asc' | 'desc';

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

export interface CandidateListQueryParams {
  verdict?: CandidateVerdict;
  search?: string;
  sort?: CandidateSortField;
  order?: CandidateSortOrder;
  page: number;
}

export interface Candidate {
  id: string;
  name: string;
  position: string;
  pos_label: string;
  file: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  tg: string | null;
  exp: CandidateExperienceItem[];
  total_exp: string;
  stack: string;
  edu: string | null;
  verdict: CandidateVerdict;
  vc: string;
  criteria: CandidateCriterion[];
  summary: string;
  questions: string[];
  status: CandidateWorkflowStatus;
  createdAt: string;
}
