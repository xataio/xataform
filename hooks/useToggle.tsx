import { useCallback } from "react";
import { useState } from "react";

export function useToggle(defaultValue = false) {
  const [value, setValue] = useState(defaultValue);
  const toggle = useCallback(() => setValue((i) => !i), [setValue]);

  return [value, toggle] as const;
}
