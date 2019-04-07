import { reaction } from "mobx";
import { useEffect, useState } from "preact/hooks/src";

export function useObserver<T>(cb: () => T, deps: readonly unknown[] = []): T {
  const [value, setValue] = useState(cb)
  useEffect(() => {
    setValue(cb)
    return reaction(cb,  setValue)
  }, deps)
  return value
}
