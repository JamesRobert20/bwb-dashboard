"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { scanFormSchema, type ScanFormData } from "@/lib/validations";

interface ScannerFormProps {
  onScan: (data: ScanFormData) => void;
  isLoading?: boolean;
}

export function ScannerForm({ onScan, isLoading }: ScannerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ScanFormData>({
    resolver: zodResolver(scanFormSchema),
    defaultValues: {
      ticker: "SPY",
      expiry: "",
    },
  });

  const onSubmit = (data: ScanFormData) => {
    onScan(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="ticker">Ticker Symbol</Label>
          <Input
            id="ticker"
            placeholder="SPY"
            {...register("ticker")}
            className="uppercase"
            disabled={isLoading}
          />
          {errors.ticker && (
            <p className="text-sm text-red-500">{errors.ticker.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiry">
            Expiry Date <span className="text-zinc-500">(Optional)</span>
          </Label>
          <Input
            id="expiry"
            type="date"
            placeholder="YYYY-MM-DD"
            {...register("expiry")}
            disabled={isLoading}
          />
          {errors.expiry && (
            <p className="text-sm text-red-500">{errors.expiry.message}</p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full md:w-auto"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Scanning...
          </>
        ) : (
          <>
            <Search className="h-4 w-4" />
            Scan for BWB Strategies
          </>
        )}
      </Button>
    </form>
  );
}