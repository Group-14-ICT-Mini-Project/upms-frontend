import { useState, useEffect } from "react";
import type { UserContext } from "../types";
import type { Procurement } from "../types";
import { useProcurements } from "../ProcurementContext";

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
  const { getProcurementsForUser, procurements } = useProcurements();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    // Reset when role changes (e.g. user switches account)
    setIsLoading(true);
    setData(null);

    // Simulated network delay: 1000–1400 ms
    const delay = 1000 + Math.random() * 400;

    const timer = setTimeout(() => {
      const visibleProcurements = getProcurementsForUser(user);
      setData({
        queue: getActionQueueForUser(user, visibleProcurements),
        procurements: visibleProcurements,
      });
      setIsLoading(false);
    }, delay);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.role, user.faculty, user.department, procurements]);

  return { isLoading, data };
}

function getActionQueueForUser(user: UserContext, procurements: Procurement[]) {
  const statusesByRole: Record<UserContext["role"], Procurement["status"][]> = {
    HOD: ["Quality Report Required"],
    BUR: ["Pending Fund Verification"],
    FBUR: ["Pending Fund Verification"],
    SDC: ["Funds Verified"],
    TEC: ["Technical Evaluation"],
    TB: ["Authority Approval"],
    STK: ["Awaiting Delivery"],
    SUP: ["Bidding Open"],
    FIN: ["Payment Pending"],
  };

  return procurements.filter(item => statusesByRole[user.role].includes(item.status));
}
