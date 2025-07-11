// https://github.com/kentcdodds/use-deep-compare-effect/blob/master/src/index.ts
import { isEqual } from "lodash";
import * as React from "react";

type UseEffectParams = Parameters<typeof React.useEffect>;
type EffectCallback = UseEffectParams[0];
type DependencyList = UseEffectParams[1];
// yes, I know it's void, but I like what this communicates about
// the intent of these functions: It's just like useEffect
type UseEffectReturn = ReturnType<typeof React.useEffect>;

function useDeepCompareMemoize(value: DependencyList) {
  const ref = React.useRef<DependencyList>();
  const signalRef = React.useRef<number>(0);

  if (!isEqual(value, ref.current)) {
    ref.current = value;
    signalRef.current += 1;
  }

  return [signalRef.current];
}

function useDeepCompareEffect(
  callback: EffectCallback,
  dependencies: DependencyList,
): UseEffectReturn {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useEffect(callback, useDeepCompareMemoize(dependencies));
}

export default useDeepCompareEffect;
