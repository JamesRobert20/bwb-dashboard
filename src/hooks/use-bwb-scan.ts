"use client";

import { useQuery } from "@tanstack/react-query";
import { scanBWB } from "@/lib/api";
import { ScanRequest } from "@/types/bwb";

export function useBWBScan(request: ScanRequest | null) {
  return useQuery({
    queryKey: ["bwb-scan", request?.ticker, request?.expiry],
    queryFn: () => {
      if (!request) throw new Error("No scan request provided");
      return scanBWB(request);
    },
    enabled: !!request,
    staleTime: 5 * 60 * 1000,
  });
}