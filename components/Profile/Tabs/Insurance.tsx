import React from "react";
import InsuranceTable from "@/components/Profile/InsuranceTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const InsuranceTab = () => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        <div className="flex flex-col mt-5 mb-10 space-y-6">
        <style jsx global>{`
        .title { font-family: "Times New Roman", serif; text-transform: capitalize; color: #0b1f3a; }
      `}</style>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
            <p className="title bg-white !text-xl sm:text-base font-medium w-full lg:col-span-4 border-b">
              General Liability
            </p>
            <FormItem>
              <Label className="!text-sm font-normal">Covered</Label>
              <Select>
                <SelectTrigger className="">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
            <FormItem>
              <Label className="!text-sm font-normal">Insurance Producer</Label>
              <Input value={""} />
            </FormItem>
            <FormItem>
              <Label className="!text-sm font-normal">Agent Phone Number</Label>
              <Input value={""} />
            </FormItem>
            <FormItem>
              <Label className="!text-sm font-normal">Expiration</Label>
              <Input value={""} />
            </FormItem>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
            <p className="title bg-white !text-xl sm:text-base font-medium w-full lg:col-span-4 border-b">
              Automobile
            </p>
            <FormItem>
              <Label className="!text-sm font-normal">Covered</Label>
              <Select>
                <SelectTrigger className="">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
            <FormItem>
              <Label className="!text-sm font-normal">Insurance Producer</Label>
              <Input value={""} />
            </FormItem>
            <FormItem>
              <Label className="!text-sm font-normal">Agent Phone Number</Label>
              <Input value={""} />
            </FormItem>
            <FormItem>
              <Label className="!text-sm font-normal">Expiration</Label>
              <Input value={""} />
            </FormItem>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
            <p className="title bg-white !text-xl sm:text-base font-medium w-full lg:col-span-4 border-b">
              Umbrella
            </p>
            <FormItem>
              <Label className="!text-sm font-normal">Covered</Label>
              <Select>
                <SelectTrigger className="">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
            <FormItem>
              <Label className="!text-sm font-normal">Insurance Producer</Label>
              <Input value={""} />
            </FormItem>
            <FormItem>
              <Label className="!text-sm font-normal">Agent Phone Number</Label>
              <Input value={""} />
            </FormItem>
            <FormItem>
              <Label className="!text-sm font-normal">Expiration</Label>
              <Input value={""} />
            </FormItem>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
            <p className="title bg-white !text-xl sm:text-base font-medium w-full lg:col-span-4 border-b">
              Workers Comp
            </p>
            <FormItem>
              <Label className="!text-sm font-normal">Covered</Label>
              <Select>
                <SelectTrigger className="">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
            <FormItem>
              <Label className="!text-sm font-normal">Insurance Producer</Label>
              <Input value={""} />
            </FormItem>
            <FormItem>
              <Label className="!text-sm font-normal">Agent Phone Number</Label>
              <Input value={""} />
            </FormItem>
            <FormItem>
              <Label className="!text-sm font-normal">Expiration</Label>
              <Input value={""} />
            </FormItem>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <p className="title bg-white !text-xl sm:text-base font-medium w-full lg:col-span-4 border-b pb-2">
          Insurance Documents
        </p>
        <InsuranceTable />
      </div>
    </div>
  );
};

export default InsuranceTab;
