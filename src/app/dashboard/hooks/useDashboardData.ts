import { useState, useEffect } from "react";
import type { UserContext } from "../types";
import { getActionQueueForRole, getProcurementsForRole } from "../data";
import type { Procurement } from "../types";

interface DashboardData {
  queue: Procurement[];
  procurements: Procurement[];
}

/**
 * useDashboardData
 *
 * Simulates async data fetching with a realistic 1–1.4 second delay.
 * Returns { isLoading, data } — identical API to what a real fetch hook would return.
 *
 * To connect to a real API, replace the setTimeout block with your fetch() / axios
 * call inside the useEffect, keeping the isLoading / setData pattern unchanged.
 */
export function useDashboardData(user: UserContext): {
  isLoading: boolean;
  data: DashboardData | null;
} {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    // Reset when role changes (e.g. user switches account)
    setIsLoading(true);
    setData(null);

    // Simulated network delay: 1000–1400 ms
    const delay = 1000 + Math.random() * 400;

    const timer = setTimeout(() => {
      setData({
        queue: getActionQueueForRole(user),
        procurements: getProcurementsForRole(user),
      });
      setIsLoading(false);
    }, delay);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.role]);

  return { isLoading, data };
}
