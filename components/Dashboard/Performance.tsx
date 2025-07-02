import React from "react";
import CurrencyFormat from "react-currency-format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardMetrics } from "@/components/Header";

interface Props {
  metrics: DashboardMetrics | null;
}
const Performance = ({ metrics }: Props) => {
  return (
    <div className="flex flex-col w-full">
      <span className="text-xl title mr-8">Performance Overview</span>

      <Card
        className="
         bg-blue-500/20
    backdrop-blur-md
    border border-white/30
    rounded-lg shadow-[0_0_12px_rgba(0,0,0,0.1)]
    flex flex-col mt-8 h-28
      "
      >
        <CardHeader className="pb-0 mb-4">
          <CardTitle>Total Invoiced</CardTitle>
        </CardHeader>
        <CardContent>
          <CurrencyFormat
            value={metrics?.totalInvoiced || 0}
            displayType="text"
            thousandSeparator
            prefix="$"
            className="font-bold text-2xl h-10"
          />
        </CardContent>
      </Card>

      <Card
        className="
         bg-blue-500/20
    backdrop-blur-md
    border border-white/30
    rounded-lg shadow-[0_0_12px_rgba(0,0,0,0.1)]
    flex flex-col mt-6 h-28
      "
      >
        <CardHeader className="pb-0 mb-4">
          <CardTitle>Total Collected</CardTitle>
        </CardHeader>
        <CardContent>
          <CurrencyFormat
            value={metrics?.totalCollected || 0}
            displayType="text"
            thousandSeparator
            prefix="$"
            className="font-bold text-2xl"
          />
        </CardContent>
      </Card>

      <Card
        className="
         bg-blue-500/20
    backdrop-blur-md
    border border-white/30
    rounded-lg shadow-[0_0_12px_rgba(0,0,0,0.1)]
    flex flex-col mt-6 h-28
      "
      >
        <CardHeader className="pb-0 mb-4">
          <CardTitle>Projects Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-bold text-2xl">
            {metrics ? metrics.totalProjects - metrics.openProjects : 0}
          </p>
        </CardContent>
      </Card>

      <Card
        className="
         bg-blue-500/20
    backdrop-blur-md
    border border-white/30
    rounded-lg shadow-[0_0_12px_rgba(0,0,0,0.1)]
    flex flex-col mt-6 h-28
      "
      >
        <CardHeader className="pb-0 mb-4">
          <CardTitle>Projects Open</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-bold text-2xl">{metrics?.openProjects || 0}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Performance;
