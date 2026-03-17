import { useRef } from "react";
import { useProjectStore } from "./useProjectStore";
import { shallow } from "zustand/shallow";

/**
 * React 19-safe Zustand wrapper.
 * Prevents “getSnapshot should be cached” warning and infinite re-renders.
 */
export function useSafeStore(selector) {
  const value = useProjectStore(selector, shallow);
  const ref = useRef(value);

  if (ref.current !== value) {
    ref.current = value;
  }

  return ref.current;
  
}
