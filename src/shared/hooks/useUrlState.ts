import { useSearchParams } from 'react-router';

export const useUrlState = (key: string, defaultValue = '') => {
  const [params, setParams] = useSearchParams();
  const value = params.get(key) ?? defaultValue;

  const setValue = (next: string) => {
    setParams(
      (prev) => {
        const p = new URLSearchParams(prev);
        if (next === '' || next === defaultValue) p.delete(key);
        else p.set(key, next);
        return p;
      },
      { replace: true },
    );
  };

  return [value, setValue] as const;
};
