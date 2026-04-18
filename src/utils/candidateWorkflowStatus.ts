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
