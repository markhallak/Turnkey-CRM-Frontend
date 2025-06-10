"use client";

import Wrapper from "@/components/Wrapper";
import { clientsData } from "@/lib/constants";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import CurrencyFormat from "react-currency-format";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import InvoiceTab from "@/components/Clients/Tabs/Invoices";
import PaperworkTab from "@/components/Clients/Tabs/PaperWork";
import ProjectsTab from "@/components/Clients/Tabs/Projects";

const ClientDetails = () => {
  const router = useRouter();
  const { id } = router.query;

  const [clientData, setClientData] = useState<{
    id: number;
    clientName: string;
    status: "Compliant and Active" | "Compliant and Non-active";
    type: "commercial" | "residential";
    totalRevenue: number;
  } | null>(null);

  const [inputValue, setInputValue] = useState("1600 Amphitheatre Parkway");
  const [confirmedValue, setConfirmedValue] = useState(
    "1600 Amphitheatre Parkway"
  );

  const [mapSrc, setMapSrc] = useState("https://www.google.com/maps/embed?...");

  useEffect(() => {
    if (id && typeof id === "string") {
      const client = clientsData.find((c) => c.clientName === id);
      setClientData(client || null);
    }
  }, [id]);

  useEffect(() => {
    setMapSrc(
      `https://www.google.com/maps?q=${encodeURIComponent(
        inputValue
      )}&output=embed`
    );
  }, [inputValue]);

  const inputError = inputValue.trim() === "";
  const showTopCheck = !inputError && inputValue !== confirmedValue;

  const handleTopConfirm = () => {
    if (inputError) return;
    setConfirmedValue(inputValue);
    setMapSrc(
      `https://www.google.com/maps?q=${encodeURIComponent(
        inputValue
      )}&output=embed`
    );
  };

  function handleStatusChange(
    newStatus: "Compliant and Active" | "Compliant and Non-active"
  ) {
    setClientData((prev) => (prev ? { ...prev, status: newStatus } : prev));
  }

  return (
    <Wrapper title={clientData?.clientName || "Client Not Found"}>
      <div className="flex flex-col pt-6 pb-16">
        <div className="border mt-5 rounded-lg w-full space-y-6">
          <div className="px-5 pt-5 flex w-full flex-wrap justify-between gap-2">
            <div className="relative flex-1 max-w-[40%]">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type Client's address"
                className={cn(
                  "w-full pr-10",
                  inputError && "focus:!ring-0",
                  inputError && "!border-red-500"
                )}
              />

              {showTopCheck && (
                <Check
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 cursor-pointer"
                  onClick={handleTopConfirm}
                />
              )}
              {inputError && (
                <p className="mt-1 text-sm text-red-600">
                  Address cannot be empty.
                </p>
              )}
            </div>
            <Select
              value={clientData?.status}
              onValueChange={(val) => handleStatusChange(val)}
            >
              <SelectTrigger
                hideIcon
                className={`
          w-40 md:w-[250px] text-sm truncate justify-between text-white relative focus:!ring-0 transition-colors duration-300 ease-in-out
          ${
            clientData?.status === "Compliant and Active"
              ? "bg-green-600 hover:bg-green-500"
              : "bg-yellow-500 hover:bg-yellow-400"
          }
        `}
              >
                <SelectValue placeholder="Select Client Status" />
                <ChevronsUpDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ml-2 shrink-0 opacity-50" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Compliant and Active">
                  Compliant and Active
                </SelectItem>
                <SelectItem value="Compliant and Non-active">
                  Compliant and Non-active
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="px-5 flex flex-col md:flex-row gap-y-0 md:gap-5 items-start md:items-stretch w-full">
            <div className="relative flex-1 self-stretch mb-10 sm:mb-10 md:mb-0 lg:mb-0 md:min-h-0">
              <iframe
                src={mapSrc}
                width="100%"
                height="100%"
                className="w-full min-h-[300px] border-0 rounded-lg"
                loading="eager"
              />
            </div>

            <div className="w-full md:w-[260px] grid gap-5 shrink-0">
              {[
                { title: "Total Invoiced", value: 545691 },
                { title: "Total Collected", value: 245698 },
                { title: "Projects Completed", value: 141 },
                { title: "Projects Open", value: 62 },
              ].map((stat) => (
                <Card
                  key={stat.title}
                  className="bg-blue-500/20 backdrop-blur-md border border-white/30 rounded-lg shadow-[0_0_12px_rgba(0,0,0,0.1)] flex flex-col h-28"
                >
                  <CardHeader className="pb-0 mb-4">
                    <CardTitle>{stat.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CurrencyFormat
                      value={stat.value}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"$"}
                      className="font-bold text-2xl h-10"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Tabs
            defaultValue="invoices"
            className="flex w-full flex-col px-0 mx-0"
          >
            <TabsList
            className="h-full lg:h-14 px-4 rounded-none w-full flex flex-nowrap overflow-x-auto scrollbar-hide gap-2 justify-start lg:justify-between">
              <TabsTrigger
                className="text-lg flex-1 lg:flex-1 px-4 whitespace-nowrap text-center"
                value="invoices"
              >
                Invoices
              </TabsTrigger>
              <TabsTrigger
                className="text-lg flex-1 lg:flex-1 px-4 whitespace-nowrap text-center"
                value="paperwork"
              >
                Onboarding Paperwork
              </TabsTrigger>
              <TabsTrigger
                className="text-lg flex-1 lg:flex-1 px-4 whitespace-nowrap text-center"
                value="activeProjects"
              >
                Active Projects
              </TabsTrigger>
              <TabsTrigger
                className="text-lg flex-1 lg:flex-1 px-4 whitespace-nowrap text-center"
                value="notes"
              >
                Notes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="invoices" className="w-full p-4 py-5 pb-10">
              <InvoiceTab />
            </TabsContent>

            <TabsContent value="paperwork" className="w-full p-4 py-5 pb-10">
              <PaperworkTab />
            </TabsContent>

            <TabsContent
              value="activeProjects"
              className="w-full p-4 py-5 pb-10"
            >
              <ProjectsTab />
            </TabsContent>
            <TabsContent value="notes" className="flex-1 overflow-auto p-4">
                <ScrollArea className="h-full">
                  <div className="grid lg:grid-cols-1 xl:grid-cols-2 gap-4">
                    <div className="ml-2 mb-2">
                      <label className="text-sm">Updates</label>
                      <Textarea className="mt-1.5" rows={12} />
                    </div>
                    <div className="mr-2 mb-2">
                      <label className="text-sm">Special Notes</label>
                      <Textarea className="mt-1.5" rows={12} />
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
          </Tabs>
        </div>
      </div>
    </Wrapper>
  );
};

export default ClientDetails;
