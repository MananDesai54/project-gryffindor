import { useState, useCallback } from "react";

const useBoolean = (initialState = false) => {
  const [value, setValue] = useState(initialState);

  const toggle = useCallback(() => setValue((value) => !value), []);
  const set = useCallback(() => setValue(true), []);
  const unset = useCallback(() => setValue(false), []);

  return { value, set, unset, toggle, setValue };
};

export default useBoolean;
