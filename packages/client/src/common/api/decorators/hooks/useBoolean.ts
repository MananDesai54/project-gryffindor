import { useState, useCallback } from "react";

const useBoolean = (initialState = false) => {
  const [value, setValue] = useState(initialState);

  const toggle = useCallback(() => setValue((value) => !value), []);
  const set = useCallback((val: boolean) => setValue(val), []);

  return { value, set, toggle, setValue };
};

export default useBoolean;
