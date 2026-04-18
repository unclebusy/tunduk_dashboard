import { describe, expect, it } from 'vitest';
import {
  getCriterionBadgeClassName,
  getCriterionLabel,
  getVerdictBadgeClassName,
  getVerdictLabel,
} from './candidateDetailStyles';

describe('candidateDetailStyles', () => {
  it('maps each verdict to the expected badge color classes', () => {
    expect(getVerdictBadgeClassName('ПОДХОДИТ')).toContain('emerald');
    expect(getVerdictBadgeClassName('ЧАСТИЧНО')).toContain('amber');
    expect(getVerdictBadgeClassName('НЕ СООТВЕТСТВУЕТ')).toContain('rose');
  });

  it('maps criterion statuses to readable labels and colors', () => {
    expect(getCriterionLabel('ok')).toBe('Подходит');
    expect(getCriterionLabel('partial')).toBe('Частично');
    expect(getCriterionLabel('no')).toBe('Не подходит');
    expect(getCriterionBadgeClassName('ok')).toContain('emerald');
    expect(getCriterionBadgeClassName('partial')).toContain('amber');
    expect(getCriterionBadgeClassName('no')).toContain('rose');
  });

  it('maps verdicts to user-facing labels aligned with the task wording', () => {
    expect(getVerdictLabel('ПОДХОДИТ')).toBe('Подходит');
    expect(getVerdictLabel('ЧАСТИЧНО')).toBe('Частично');
    expect(getVerdictLabel('НЕ СООТВЕТСТВУЕТ')).toBe('Не подходит');
  });
});
