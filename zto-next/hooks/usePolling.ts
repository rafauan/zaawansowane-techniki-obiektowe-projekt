import { useEffect, useRef } from "react";

const INTERVAL_DELAY = 500; //0.5s

export const usePolling = (callback: Function, delay = INTERVAL_DELAY) => {
  const savedCallback = useRef<Function | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const cancelPolling = () => {
    timeoutRef.current && clearTimeout(timeoutRef.current);
    intervalRef.current && clearInterval(intervalRef.current);
  };

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const startPolling = () => {
    const tick = () => {
      savedCallback.current?.();
    };
    const startFetch = () => {
      intervalRef.current = setInterval(tick, delay);
    };
    timeoutRef.current = setTimeout(startFetch);
  };

  return [startPolling, cancelPolling];
};

export default usePolling;
