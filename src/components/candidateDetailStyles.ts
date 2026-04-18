import type {
  CandidateCriterionStatus,
  CandidateVerdict,
} from '../types/candidate';

export function getVerdictBadgeClassName(verdict: CandidateVerdict): string {
  switch (verdict) {
    case 'ПОДХОДИТ':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700';
    case 'ЧАСТИЧНО':
      return 'border-amber-200 bg-amber-50 text-amber-700';
    case 'НЕ СООТВЕТСТВУЕТ':
      return 'border-rose-200 bg-rose-50 text-rose-700';
  }
}

export function getCriterionBadgeClassName(
  status: CandidateCriterionStatus,
): string {
  switch (status) {
    case 'ok':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700';
    case 'partial':
      return 'border-amber-200 bg-amber-50 text-amber-700';
    case 'no':
      return 'border-rose-200 bg-rose-50 text-rose-700';
  }
}

export function getCriterionLabel(status: CandidateCriterionStatus): string {
  switch (status) {
    case 'ok':
      return 'Подходит';
    case 'partial':
      return 'Частично';
    case 'no':
      return 'Не подходит';
  }
}
