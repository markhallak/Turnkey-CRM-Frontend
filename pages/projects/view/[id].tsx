"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Wrapper from "@/components/Wrapper";
import {
  projectDocumentData as PD,
  projectQuoteData as PQ,
  projectsData,
} from "@/lib/constants";
import {
  CalendarIcon,
  CopyIcon,
  Edit2Icon,
  Search,
  ChevronsUpDown,
} from "lucide-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { CiShop } from "react-icons/ci";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GoKebabHorizontal } from "react-icons/go";
import ChatUI from "@/components/Projects/ChatUI";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { ScrollBar } from "@/components/ui/scroll-area";

const ProjectView = () => {
  const [projectQuoteData, setProjectQuoteData] = useState(PQ);
  const [projectDocumentData, setProjectDocumentData] = useState(PD);
  const [messageType, setMessageType] = useState("all");

  type ArrayElement<T> = T extends (infer U)[] ? U : never;
  type Project = ArrayElement<typeof projectsData>;

  const [project, setProject] = useState<Project>();
  const router = useRouter();
  const { id } = router.query;

  const handleChange = (key: string, value: string | Date) =>
    setProject((p) => ({ ...p, [key]: value }));

  const handleStatusChange = (s: "Open" | "Delayed") =>
    setProject((p) => (p ? { ...p, status: s } : p));

  useEffect(() => {
    if (id && typeof id === "string" && !project) {
      const p = projectsData.find((p) => p.poNumber === id);
      setProject(p);
    }
  }, [id, project]);

  return (
    <Wrapper title="Projects">
      <div className="flex flex-col pt-6 pb-16">
        <div className="w-full flex flex-col lg:flex-row border rounded-lg lg:h-[150vh]">
          <div className="flex flex-col flex-1 min-h-0 lg:min-w-0 overflow-hidden">
            <ScrollArea className="h-auto lg:h-[80vh] lg:border-r">
              <div className="flex p-3.5 border-b items-center justify-between">
                <span className="text-lg lg:text-3xl font-semibold flex items-center">
                  {project?.client}
                  <CiShop className="mt-1 sm:mt-2 ml-2 my-1" />
                </span>
                <Select
                  value={project?.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger
                    hideIcon
                    className={cn(
                      "w-1/2 sm:w-1/3 text-sm truncate justify-between text-white relative focus:!ring-0 transition-colors duration-300 ease-in-out",
                      project?.status === "Open"
                        ? "bg-green-600 hover:bg-green-500"
                        : "bg-yellow-500 hover:bg-yellow-400"
                    )}
                  >
                    <SelectValue placeholder="Status" />
                    <ChevronsUpDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Delayed">Delayed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {project && (
                <div className="flex flex-col p-2 md:p-3.5 border-b">
                  <span className="font-semibold text-xl">
                    Project Information
                  </span>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 py-6">
                    <div>
                      <label className="text-sm">PO Number</label>
                      <Input
                        className="mt-1.5"
                        value={project.poNumber}
                        onChange={(e) =>
                          handleChange("poNumber", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm">Client</label>
                      <Select
                        value={project.client}
                        onValueChange={(v) => handleChange("client", v)}
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue placeholder="Client">
                            {project.client}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="client1">Client 1</SelectItem>
                          <SelectItem value="client2">Client 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm">Business / Tenant Name</label>
                      <Input
                        className="mt-1.5"
                        value={project.client}
                        onChange={(e) => handleChange("client", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm">Date Received</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full font-normal text-sm mt-1.5 flex justify-between"
                            onClick={() =>
                              handleChange("dateReceived", new Date())
                            }
                          >
                            {new Date().toLocaleDateString()}
                            <CalendarIcon size={16} />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <Calendar
                            mode="single"
                            selected={new Date()}
                            onSelect={(d) => handleChange("dateReceived", d!)}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <label className="text-sm">Priority</label>
                      <Select
                        value={project.priority}
                        onValueChange={(v) => handleChange("priority", v)}
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue placeholder="Priority">
                            {project.priority}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="p2">P2 - Same Day</SelectItem>
                          <SelectItem value="p3">P3 - Standard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm">Due Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full font-normal text-sm mt-1.5 flex justify-between"
                            onClick={() => handleChange("dueDate", new Date())}
                          >
                            {new Date().toLocaleDateString()}
                            <CalendarIcon size={16} />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <Calendar
                            mode="single"
                            selected={new Date()}
                            onSelect={(d) => handleChange("dueDate", d!)}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <label className="text-sm">Trade</label>
                      <Select
                        value={project.trade}
                        onValueChange={(v) => handleChange("trade", v)}
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue placeholder="Trade">
                            {project.trade}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="trade1">Trade 1</SelectItem>
                          <SelectItem value="trade2">Trade 2</SelectItem>
                          <SelectItem value="trade3">Trade 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm">NTE</label>
                      <Input
                        className="mt-1.5"
                        value={project.nte}
                        onChange={(e) => handleChange("nte", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm">Assignee</label>
                      <Select
                        value={project.assignee}
                        onValueChange={(v) => handleChange("assignee", v)}
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue placeholder="Assignee">
                            {project.assignee}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="assignee1">Assignee 1</SelectItem>
                          <SelectItem value="assignee2">Assignee 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
              {project && (
                <div className="flex flex-col p-3.5">
                  <span className="font-semibold text-xl">
                    Site Information
                  </span>
                  <div className="grid lg:grid-cols-3 gap-4 py-6">
                    <div>
                      <label className="text-sm">Address Line 1</label>
                      <Input className="mt-1.5" value={project.address} />
                    </div>
                    <div>
                      <label className="text-sm">Address Line 2</label>
                      <Input className="mt-1.5" value={project.address} />
                    </div>
                    <div>
                      <label className="text-sm">City</label>
                      <Input className="mt-1.5" value="Houston" />
                    </div>
                    <div>
                      <label className="text-sm">State</label>
                      <Select value="Texas">
                        <SelectTrigger className="mt-1.5">
                          <SelectValue>Texas</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="state1">State 1</SelectItem>
                          <SelectItem value="state2">State 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm">Zip Code</label>
                      <Input className="mt-1.5" value="12345" />
                    </div>
                  </div>
                </div>
              )}
            </ScrollArea>
            <Tabs
              defaultValue="sow"
              className="w-full flex flex-col flex-1 h-16 overflow-hidden"
            >
              <TabsList className="h-16 sm:h-16 px-6 rounded-none w-full overflow-x-auto whitespace-nowrap flex gap-2 justify-start">
                <TabsTrigger className="text-lg flex-grow" value="sow">
                  Client Sow
                </TabsTrigger>
                <TabsTrigger className="text-lg flex-grow" value="assessment">
                  Assessments
                </TabsTrigger>
                <TabsTrigger className="text-lg flex-grow" value="quote">
                  Quote
                </TabsTrigger>
                <TabsTrigger className="text-lg flex-grow" value="document">
                  Documents
                </TabsTrigger>
              </TabsList>
              <TabsContent value="sow" className="flex-1 overflow-auto p-4">
                <ScrollArea className="h-full">
                  <div className="grid lg:grid-cols-1 xl:grid-cols-2 gap-4">
                    <div className="ml-2">
                      <label className="text-sm">Scope of Work</label>
                      <Textarea className="mt-1.5" rows={12} />
                    </div>
                    <div className="mr-2">
                      <label className="text-sm">Special Notes</label>
                      <Textarea className="mt-1.5" rows={12} />
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent
                value="assessment"
                className="flex-1 overflow-auto p-4"
              >
                <ScrollArea className="h-full">
                  <div className="grid lg:grid-cols-1 xl:grid-cols-2 gap-4">
                    <div className="ml-2">
                      <label className="text-sm">Visit Notes</label>
                      <Textarea className="mt-1.5" rows={12} />
                    </div>
                    <div className="flex flex-col space-y-2 mr-2 p-0">
                      <div>
                        <label className="text-sm">Planned Resolution</label>
                        <Textarea className="mt-1.5" rows={5} />
                      </div>
                      <div>
                        <label className="text-sm">Material/Parts Needed</label>
                        <Textarea className="mt-1.5" rows={4} />
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="quote" className="flex-1 overflow-auto p-0">
                <ScrollAreaPrimitive.Root className="relative w-full h-full">
                  <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
                    <div className="flex flex-col md:flex-row md:justify-between px-2.5 md:px-7 mb-5 mt-5">
                      <div className="relative w-full md:w-fit">
                        <Search
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                          size={18}
                        />
                        <Input
                          type="text"
                          onChange={(e) => {
                            const q = e.target.value;
                            if (!q) setProjectQuoteData(PQ);
                            else
                              setProjectQuoteData(
                                PQ.filter((d) =>
                                  `${d.number}`
                                    .toLowerCase()
                                    .includes(q.toLowerCase())
                                )
                              );
                          }}
                          placeholder="Search..."
                          className="pl-10 focus:ring-0"
                        />
                      </div>
                      <Button variant="default" className="my-5 md:my-0">
                        <Link href="/quote/new">
                          <span className="!text-base">New Quotation</span>
                        </Link>
                      </Button>
                    </div>
                    <Table className="table-auto min-w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-left lg:pl-8 w-16 md:w-28 lg:w-fit">
                            Number
                          </TableHead>
                          <TableHead className="w-24 lg:w-fit">
                            Date Created
                          </TableHead>
                          <TableHead className="w-16 lg:w-fit">
                            Amount
                          </TableHead>
                          <TableHead className="w-20 lg:w-fit">
                            Status
                          </TableHead>
                          <TableHead className="w-20" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {projectQuoteData.map((d) => (
                          <TableRow
                            key={d.id}
                            className="cursor-pointer"
                            onClick={() => router.push("/quote/view/" + d.id)}
                          >
                            <TableCell className="font-normal text-left lg:pl-8 break-all">
                              {d.number}
                            </TableCell>
                            <TableCell>
                              {d.dateCreated.toLocaleDateString()}
                            </TableCell>
                            <TableCell>${d.amount}</TableCell>
                            <TableCell className="capitalize">
                              {d.status}
                            </TableCell>
                            <TableCell className="pr-5">
                              <div className="flex space-x-0.5">
                                <button className="shadow-sm border rounded-md p-1.5">
                                  <Edit2Icon size={15} />
                                </button>
                                <button className="shadow-sm border rounded-md p-1.5">
                                  <CopyIcon size={15} />
                                </button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <button className="shadow-sm border rounded-md p-1.5">
                                      <GoKebabHorizontal size={15} />
                                    </button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      View Document
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      Download
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>Delete</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollAreaPrimitive.Viewport>
                  <ScrollBar orientation="horizontal" />
                  <ScrollBar orientation="vertical" />

                  <ScrollAreaPrimitive.Corner />
                </ScrollAreaPrimitive.Root>
              </TabsContent>
              <TabsContent
                value="document"
                className="flex-1 overflow-auto p-0"
              >
                <ScrollAreaPrimitive.Root className="relative w-full h-full">
                  <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
                    <div className="flex flex-col md:flex-row md:justify-between px-2.5 md:px-7 mb-5 mt-5">
                      <div className="relative w-full md:w-fit">
                        <Search
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                          size={18}
                        />
                        <Input
                          type="text"
                          onChange={(e) => {
                            const q = e.target.value;
                            if (!q) setProjectDocumentData(PD);
                            else
                              setProjectDocumentData(
                                PD.filter((d) =>
                                  d.title
                                    .toLowerCase()
                                    .includes(q.toLowerCase())
                                )
                              );
                          }}
                          placeholder="Search..."
                          className="pl-10 focus:ring-0"
                        />
                      </div>
                      <Button variant="default" className="my-5 md:my-0">
                        Add Document
                      </Button>
                    </div>
                    <Table className="table-auto min-w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-left pl-8 w-36 md:w-40 xl:w-fit">
                            Title
                          </TableHead>
                          <TableHead className="w-28 lg:w-fit">Type</TableHead>
                          <TableHead className="w-24 lg:w-fit">
                            Date Uploaded
                          </TableHead>
                          <TableHead className="w-20" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {projectDocumentData.map((d) => (
                          <TableRow key={d.id}>
                            <TableCell className="font-normal text-left md:pl-8 break-all">
                              {d.title}
                            </TableCell>
                            <TableCell>{d.type}</TableCell>
                            <TableCell>
                              {d.dateCreated.toLocaleDateString()}
                            </TableCell>
                            <TableCell className="pr-3 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="shadow-sm border rounded-md p-1.5">
                                    <GoKebabHorizontal size={15} />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    View Document
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>Download</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollAreaPrimitive.Viewport>
                  <ScrollBar orientation="horizontal" />
                  <ScrollBar orientation="vertical" />

                  <ScrollAreaPrimitive.Corner />
                </ScrollAreaPrimitive.Root>
              </TabsContent>
            </Tabs>
          </div>
          <div className="w-full lg:w-[40%] lg:border-l border-t lg:border-t-0 flex-none h-full overflow-auto">
            <div className="flex flex-col h-full min-h-0 overflow-hidden">
            
              <ChatUI clientname={project?.client || ""} />
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default ProjectView;
