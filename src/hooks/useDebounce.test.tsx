import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  it('keeps the previous value until the delay passes', () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(
      ({ value, delayMs }) => useDebounce(value, delayMs),
      {
        initialProps: {
          value: 'first',
          delayMs: 300,
        },
      },
    );

    expect(result.current).toBe('first');

    rerender({ value: 'second', delayMs: 300 });

    expect(result.current).toBe('first');

    act(() => {
      vi.advanceTimersByTime(299);
    });

    expect(result.current).toBe('first');

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(result.current).toBe('second');
    vi.useRealTimers();
  });

  it('cancels the previous timeout when the value changes again', () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(
      ({ value, delayMs }) => useDebounce(value, delayMs),
      {
        initialProps: {
          value: 'first',
          delayMs: 300,
        },
      },
    );

    rerender({ value: 'second', delayMs: 300 });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    rerender({ value: 'third', delayMs: 300 });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current).toBe('first');

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe('third');
    vi.useRealTimers();
  });
});
