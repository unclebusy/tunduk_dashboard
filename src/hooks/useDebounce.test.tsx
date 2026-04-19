import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { describe, expect, it, jest } from '@jest/globals';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  it('keeps the previous value until the delay passes', () => {
    jest.useFakeTimers();

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
      jest.advanceTimersByTime(299);
    });

    expect(result.current).toBe('first');

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(result.current).toBe('second');
    jest.useRealTimers();
  });

  it('cancels the previous timeout when the value changes again', () => {
    jest.useFakeTimers();

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
      jest.advanceTimersByTime(200);
    });

    rerender({ value: 'third', delayMs: 300 });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(result.current).toBe('first');

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(result.current).toBe('third');
    jest.useRealTimers();
  });
});
