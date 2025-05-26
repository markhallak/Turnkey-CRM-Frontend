"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";

export function OnboardingPage() {
  const [industry, setIndustry] = React.useState<string | undefined>();
  const [country, setCountry] = React.useState<string | undefined>();
  const [dataTypes, setDataTypes] = React.useState<string[]>([]);

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-6">
      <Tabs defaultValue="general" className="space-y-2">
        <TabsList className="flex space-x-8">
          <TabsTrigger value="general" className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-purple-500" />
            <span>General information</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-gray-300" />
            <span>Security information</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="h-px bg-muted" />
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">General information</h1>
        <p className="text-sm text-muted-foreground">
          First, we need to know a little bit more about your organization.
        </p>
      </div>
      <form className="space-y-8">
        <div className="space-y-2">
          <Label htmlFor="industry">2. Industry</Label>
          <Select id="industry" value={industry} onValueChange={setIndustry}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose an industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aerospace">Aerospace Industry</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="healthcare">Health care</SelectItem>
              <SelectItem value="pharmaceutical">Pharmaceutical</SelectItem>
              <SelectItem value="software">Software development</SelectItem>
              <SelectItem value="telecom">Telecommunication</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">3. Country</Label>
          <Select id="country" value={country} onValueChange={setCountry}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="usa">United States</SelectItem>
              <SelectItem value="canada">Canada</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="australia">Australia</SelectItem>
              <SelectItem value="germany">Germany</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>4. Type of data</Label>
          <ToggleGroup
            type="multiple"
            className="grid grid-cols-2 gap-4"
            value={dataTypes}
            onValueChange={setDataTypes}
          >
            <ToggleGroupItem
              value="financial"
              className="border rounded-lg p-4 text-sm"
            >
              Financial data
            </ToggleGroupItem>
            <ToggleGroupItem
              value="health"
              className="border rounded-lg p-4 text-sm"
            >
              Health data
            </ToggleGroupItem>
            <ToggleGroupItem
              value="personal"
              className="border rounded-lg p-4 text-sm"
            >
              Personal data
            </ToggleGroupItem>
            <ToggleGroupItem
              value="none"
              className="border rounded-lg p-4 text-sm"
            >
              Not any data of this kind
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <Button type="submit" className="w-full">
          Next
        </Button>
      </form>
    </div>
  );
}
