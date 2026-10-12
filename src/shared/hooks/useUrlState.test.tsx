import { describe, expect, it } from 'vitest';
import { act, renderHookWithProviders } from '@/test/render';
import { useUrlState } from './useUrlState';

describe('useUrlState', () => {
  it('reads the value from the URL', () => {
    const { result } = renderHookWithProviders(() => useUrlState('q'), { route: '/?q=react' });

    expect(result.current[0]).toBe('react');
  });

  it('falls back to the default value', () => {
    const { result } = renderHookWithProviders(() => useUrlState('page', '1'));

    expect(result.current[0]).toBe('1');
  });

  it('updates and clears the value', () => {
    const { result } = renderHookWithProviders(() => useUrlState('q'));

    act(() => result.current[1]('vite'));
    expect(result.current[0]).toBe('vite');

    act(() => result.current[1](''));
    expect(result.current[0]).toBe('');
  });
});
