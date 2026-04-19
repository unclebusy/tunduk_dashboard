export function isFilledValue(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function getDisplayValue(
  value: unknown,
  fallback = 'Не указан',
): string {
  return isFilledValue(value) ? value.trim() : fallback;
}

export function getPhoneHref(value: unknown): string | undefined {
  return isFilledValue(value) ? `tel:${value.trim()}` : undefined;
}

export function getTelegramHref(value: unknown): string | undefined {
  return isFilledValue(value)
    ? `https://t.me/${value.trim().replace(/^@/, '')}`
    : undefined;
}

export function getEmailHref(value: unknown): string | undefined {
  return isFilledValue(value) ? `mailto:${value.trim()}` : undefined;
}
