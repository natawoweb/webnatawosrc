
import { useEventSubscription } from "./events/useEventSubscription";
import { useEventQuery } from "./events/useEventQuery";

export function useDashboardData(userId: string | undefined) {
  // Set up real-time subscription
  useEventSubscription(userId);
  
  // Return the event query
  return useEventQuery(userId);
}
