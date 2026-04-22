import { useEffect, useState } from "react";

export default function useTimer(limit, onExpire) {

  const [timeLeft, setTimeLeft] = useState(limit);

  useEffect(() => {
    if (limit === "nelimitat") return;

    setTimeLeft(limit);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);

  }, [limit]);

  return timeLeft;
}