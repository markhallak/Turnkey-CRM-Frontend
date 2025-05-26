import React from "react";
import CurrencyFormat from "react-currency-format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Performance = () => {
  return (
    <div className="flex flex-col w-full">
      <span className="text-2xl font-medium">Performance Overview</span>

      <Card
        className="
         bg-blue-500/20
    backdrop-blur-md
    border border-white/30
    rounded-lg shadow-lg
    flex flex-col mt-11 h-28
      "
      >
        <CardHeader className="pb-0 mb-4">
          <CardTitle>Total Invoiced</CardTitle>
        </CardHeader>
        <CardContent>
          <CurrencyFormat
            value={545691}
            displayType={"text"}
            thousandSeparator={true}
            prefix={"$"}
            className="font-bold text-2xl h-10"
          />
        </CardContent>
      </Card>

      <Card
        className="
         bg-blue-500/20
    backdrop-blur-md
    border border-white/30
    rounded-lg shadow-lg
    flex flex-col mt-6 h-28
      "
      >
        <CardHeader className="pb-0 mb-4">
          <CardTitle>Total Collected</CardTitle>
        </CardHeader>
        <CardContent>
          <CurrencyFormat
            value={245698}
            displayType={"text"}
            thousandSeparator={true}
            prefix={"$"}
            className="font-bold text-2xl"
          />
        </CardContent>
      </Card>

      <Card
        className="
         bg-blue-500/20
    backdrop-blur-md
    border border-white/30
    rounded-lg shadow-lg
    flex flex-col mt-6 h-28
      "
      >
        <CardHeader className="pb-0 mb-4">
          <CardTitle>Projects Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-bold text-2xl">141</p>
        </CardContent>
      </Card>

      <Card
        className="
         bg-blue-500/20
    backdrop-blur-md
    border border-white/30
    rounded-lg shadow-lg
    flex flex-col mt-6 h-28
      "
      >
        <CardHeader className="pb-0 mb-4">
          <CardTitle>Projects Open</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-bold text-2xl">62</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Performance;
