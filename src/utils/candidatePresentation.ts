import type { CandidateVerdict } from '../types/candidate';

export function getCandidateDecisionSummary(verdict: CandidateVerdict): string {
  switch (verdict) {
    case 'ПОДХОДИТ':
      return 'Кандидат закрывает ключевые требования и выглядит готовым к следующему этапу';
    case 'ЧАСТИЧНО':
      return 'Есть рабочая база, но остаются пробелы, которые нужно уточнить на интервью';
    case 'НЕ СООТВЕТСТВУЕТ':
      return 'Есть критичные несоответствия по профилю, опыту или стеку';
  }
}
