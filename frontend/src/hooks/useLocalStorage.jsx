import { useState } from "react";

const useLocalStorage = (keyName, defaultValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = window.localStorage.getItem(keyName);
      if (value) {
        return JSON.parse(value);
      } else {
        window.localStorage.setItem(keyName, JSON.stringify(defaultValue));
        return defaultValue;
      }
    } catch (exception) {
      return defaultValue;
    }
  });

  const setValue = (newValue) => {
    try {
      window.localStorage.setItem(keyname, JSON.stringify(newValue));
    } catch (exception) {
      console.log(exception);
    }
    setStoredValue(newValue);
  };

  const remove = () => {
    window.localStorage.removeItem(keyName);
  };

  return {
    value: storedValue,
    setValue,
    remove,
  };
};

export default useLocalStorage;
