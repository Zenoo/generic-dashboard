import {useCallback, useEffect, useState} from 'react';

const useLocalStorage = (key: string, initialValue: string) => {
  const [state, setState] = useState<string | null>(null);

  useEffect(() => {
    const initialize = (key: string) => {
      try {
        const item = localStorage.getItem(key);
        if (item && item !== 'undefined') {
          return JSON.parse(item);
        }

        localStorage.setItem(key, initialValue);
        return initialValue;
      } catch {
        return initialValue;
      }
    };
    setState(initialize(key));
  }, [initialValue, key]);

  const setValue = useCallback(
    (value: string) => {
      try {
        setState(value);
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.log(error);
      }
    },
    [key, setState]
  );

  const remove = useCallback(() => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.log(error);
    }
  }, [key]);

  return [state, setValue, remove] as const;
};

export default useLocalStorage;
