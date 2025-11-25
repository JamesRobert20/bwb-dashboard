"use server";

import { revalidatePath } from "next/cache";
import { scanBWB } from "./api";
import { ScanRequest } from "@/types/bwb";

export async function scanBWBAction(formData: FormData) {
  const ticker = formData.get("ticker") as string;
  const expiry = formData.get("expiry") as string | null;

  if (!ticker) {
    return { error: "Ticker is required" };
  }

  try {
    const request: ScanRequest = {
      ticker: ticker.toUpperCase(),
      ...(expiry && { expiry }),
    };

    const result = await scanBWB(request);
    
    revalidatePath("/");
    revalidatePath("/results");
    
    return { success: true, data: result };
  } catch (error) {
    console.error("Scan error:", error);
    return { 
      error: error instanceof Error ? error.message : "Failed to scan BWB strategies" 
    };
  }
}