import { useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValueI] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);

      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = (value: T) => {
    try {
      setStoredValueI(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.error("Error setting localStorage", key);
    }
  };

  const deleteStoredValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValueI(undefined as T);
    } catch {
      console.error("Error removing localStorage", key);
    }
  };

  return [storedValue, setStoredValue, deleteStoredValue] as const;
}
