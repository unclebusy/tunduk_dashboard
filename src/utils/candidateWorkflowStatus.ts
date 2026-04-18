import type { CandidateWorkflowStatus } from '../types/candidate';

export function getCandidateWorkflowStatusLabel(
  status: CandidateWorkflowStatus,
): string {
  switch (status) {
    case 'new':
      return 'Новый';
    case 'review':
      return 'На рассмотрении';
    case 'invited':
      return 'Приглашён';
    case 'rejected':
      return 'Отклонён';
  }
}

export function getCandidateWorkflowStatusClassName(
  status: CandidateWorkflowStatus,
): string {
  switch (status) {
    case 'new':
      return 'border-slate-200 bg-slate-50 text-slate-600';
    case 'review':
      return 'border-[#1560BD]/20 bg-[#1560BD]/10 text-[#1560BD]';
    case 'invited':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700';
    case 'rejected':
      return 'border-rose-200 bg-rose-50 text-rose-700';
  }
}
