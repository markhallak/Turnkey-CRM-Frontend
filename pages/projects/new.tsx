import Wrapper from "@/components/Wrapper";
import Link from "next/link";
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { encryptPost, decryptPost } from "@/lib/apiClient";

// Validation schema
const formSchema = z.object({
  poNumber: z.string().min(1, "Required"),
  client: z.string().min(1, "Required"),
  businessName: z.string().min(1, "Required"),
  dateReceived: z.date({ required_error: "Required" }),
  priority: z.string().min(1, "Required"),
  dueDate: z.date({ required_error: "Required" }),
  trade: z.string().min(1, "Required"),
  nte: z.string()
    .min(1, "Required")
    .regex(/^\d+(?:\.\d{2})?$/, "NTE must be a number, optionally with two decimals"),
  assignee: z.string().min(1, "Required"),
  address1: z.string().min(1, "Required"),
  address2: z.string().optional(),
  city: z.string().min(1, "Required"),
  state: z.string().min(1, "Required"),
  zipCode: z.string()
    .min(1, "Required")
    .regex(/^\d{4,5}$/, "Zip Code must be 4 or 5 digits"),
  scopeOfWork: z.string().min(1, "Required"),
  specialNotes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const NewProject = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateReceived: undefined,
      dueDate: undefined,
    } as any,
  });
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  async function onSubmit(values: FormValues) {
    try {
      await decryptPost(
        await encryptPost("/create-new-project", {
          client: values.client,
          businessName: values.businessName,
          dateReceived: values.dateReceived,
          priority: values.priority,
          dueDate: values.dueDate,
          trade: values.trade,
          nte: values.nte,
          assignee: values.assignee,
          address1: values.address1,
          address2: values.address2,
          city: values.city,
          state: values.state,
          zipCode: values.zipCode,
          scopeOfWork: values.scopeOfWork,
          specialNotes: values.specialNotes,
        })
      );
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Wrapper title="New Project">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col pt-6">
          <div className="border p-6 mb-5 rounded-md w-full mt-5 mx-auto">
            {/* First Row */}
            <div className="grid lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-5">
              <div>
                <label className="text-sm">PO Number</label>
                <Input className="mt-1.5" {...form.register("poNumber")} />
                {errors.poNumber && <p className="text-red-500 text-sm">{errors.poNumber.message}</p>}
              </div>
              <div>
                <label className="text-sm">Client</label>
                <Controller
                  control={control}
                  name="client"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select Client" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="client1">Client 1</SelectItem>
                        <SelectItem value="client2">Client 2</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.client && <p className="text-red-500 text-sm">{errors.client.message}</p>}
              </div>
              <div>
                <label className="text-sm">Business / Tenant Name</label>
                <Input className="mt-1.5" {...form.register("businessName")} />
                {errors.businessName && <p className="text-red-500 text-sm">{errors.businessName.message}</p>}
              </div>
              <div>
                <label className="text-sm">Date Received</label>
                <Controller
                  control={control}
                  name="dateReceived"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full font-normal mt-1.5 flex justify-between"
                        >
                          {field.value
                            ? field.value.toLocaleDateString()
                            : "Select Date"}
                          <CalendarIcon size={16} />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => date && field.onChange(date)}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errors.dateReceived && <p className="text-red-500 text-sm">{errors.dateReceived.message}</p>}
              </div>
              <div>
                <label className="text-sm">Priority</label>
                <Controller
                  control={control}
                  name="priority"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.priority && <p className="text-red-500 text-sm">{errors.priority.message}</p>}
              </div>

              {/* Second Row */}
              <div>
                <label className="text-sm">Due Date</label>
                <Controller
                  control={control}
                  name="dueDate"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full font-normal mt-1.5 flex justify-between"
                        >
                          {field.value ? field.value.toLocaleDateString() : "Select Date"}
                          <CalendarIcon size={16} />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => date && field.onChange(date)}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errors.dueDate && <p className="text-red-500 text-sm">{errors.dueDate.message}</p>}
              </div>
              <div>
                <label className="text-sm">Trade</label>
                <Controller
                  control={control}
                  name="trade"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select Trade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="trade1">Trade 1</SelectItem>
                        <SelectItem value="trade2">Trade 2</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.trade && <p className="text-red-500 text-sm">{errors.trade.message}</p>}
              </div>
              <div>
                <label className="text-sm">NTE</label>
                <Input className="mt-1.5" {...form.register("nte")} />
                {errors.nte && <p className="text-red-500 text-sm">{errors.nte.message}</p>}
              </div>
              <div>
                <label className="text-sm">Assignee</label>
                <Controller
                  control={control}
                  name="assignee"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select Assignee" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="assignee1">Assignee 1</SelectItem>
                        <SelectItem value="assignee2">Assignee 2</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.assignee && <p className="text-red-500 text-sm">{errors.assignee.message}</p>}
              </div>
            </div>

            {/* Address Section */}
            <div className="grid lg:grid-cols-3 xl:grid-cols-4 gap-4 border-y pt-4 pb-8">
              <div>
                <label className="text-sm">Address Line 1</label>
                <Input className="mt-1.5" {...form.register("address1")} />
                {errors.address1 && <p className="text-red-500 text-sm">{errors.address1.message}</p>}
              </div>
              <div>
                <label className="text-sm">Address Line 2</label>
                <Input className="mt-1.5" {...form.register("address2")} />
                {errors.address2 && <p className="text-red-500 text-sm">{errors.address2.message}</p>}
              </div>
              <div>
                <label className="text-sm">City</label>
                <Input className="mt-1.5" {...form.register("city")} />
                {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
              </div>
              <div>
                <label className="text-sm">State</label>
                <Controller
                  control={control}
                  name="state"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="state1">State 1</SelectItem>
                        <SelectItem value="state2">State 2</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}
              </div>
              <div>
                <label className="text-sm">Zip Code</label>
                <Input className="mt-1.5" {...form.register("zipCode")} />
                {errors.zipCode && <p className="text-red-500 text-sm">{errors.zipCode.message}</p>}
              </div>
            </div>

            {/* Scope of Work & Special Notes */}
            <div className="grid lg:grid-cols-1 xl:grid-cols-2 gap-4 pt-4">
              <div>
                <label className="text-sm">Scope of Work</label>
                <Textarea className="mt-1.5" {...form.register("scopeOfWork")} rows={6} />
                {errors.scopeOfWork && <p className="text-red-500 text-sm">{errors.scopeOfWork.message}</p>}
              </div>
              <div>
                <label className="text-sm">Special Notes</label>
                <Textarea className="mt-1.5" {...form.register("specialNotes")} rows={6} />
                {errors.specialNotes && <p className="text-red-500 text-sm">{errors.specialNotes.message}</p>}
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mb-16">
            <Button
              variant="outline"
              className="px-4 flex items-center py-3 h-9 md:py-1 w-full md:w-36 text-sm font-medium rounded-md"
              asChild
            >
              <Link href="/projects">Cancel</Link>
            </Button>
            <Button type="submit" variant="outline" className="px-4 flex items-center py-3 h-9 md:py-1 w-full md:w-36 text-sm font-medium text-white rounded-md bg-blue-600 hover:bg-white">
              Create Project
            </Button>
          </div>
        </form>
      </Form>
    </Wrapper>
  );
};

export default NewProject;
