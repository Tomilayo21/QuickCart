"use client";

import React, { useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";

interface AnalyticsTrackerProps {
  children: ReactNode;
}

const AnalyticsTracker: React.FC<AnalyticsTrackerProps> = ({ children }) => {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    // Log page view event whenever the route changes
    fetch("/api/analytics/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "page_view", path: pathname }),
    }).catch((err) => console.error("Analytics log failed:", err));
  }, [pathname]);

  return <>{children}</>;
};

export default AnalyticsTracker;
