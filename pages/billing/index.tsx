import Wrapper from "@/components/Wrapper";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SlidersHorizontal,
  ChevronUp,
  ChevronDown,
  Plus,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TbTableExport } from "react-icons/tb";
import Table from "@/components/Billing/Table";
import * as XLSX from "xlsx";

const Billing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<{ type: string[]; status: string[] }>({
    status: ["Draft", "Collected"],
  });
  const [tableInstance, setTableInstance] = useState<any>(null);
  const [columnsMenuOpen, setColumnsMenuOpen] = useState(false);
  const labelMap: Record<string, string> = {
    clientName: "Client Name",
    invoiceNumber: "Invoice Number",
    issueDate: "Issue Date",
    dueDate: "Due Date",
  };
  return (
    <Wrapper title="Billing">
      <div className="flex flex-col px-6 sm:px-0 md: px-0 lg:px-0 pt-6 pb-16">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6 w-full">
          <div className="flex-1 min-w-[240px] max-w-md">
            <div className="relative w-full group">
              <div className="relative w-full md:w-fit">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  size={16}
                  color="#666666"
                  strokeWidth={1.25}
                  absoluteStrokeWidth
                />
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="pl-10 pr-10 focus:ring-0"
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 rounded-r-md p-1 text-gray-600 focus:outline-none">
                      <SlidersHorizontal
                        size={16}
                        color="#666666"
                        strokeWidth={1.25}
                        absoluteStrokeWidth
                      />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuLabel>Advanced Filtering</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <span>Status</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuCheckboxItem
                              checked={filters.status.includes("Draft")}
                              textValue="Draft"
                              onCheckedChange={(isChecked) => {
                                const status = [...filters.status];
                                if (isChecked) {
                                  status.push("Draft");
                                } else {
                                  status.splice(status.indexOf("Draft"), 1);
                                }
                                setFilters({ ...filters, status });
                              }}
                            >
                              Draft
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                              checked={filters.status.includes("Collected")}
                              textValue="Collected"
                              onCheckedChange={(isChecked) => {
                                const status = [...filters.status];
                                if (isChecked) {
                                  status.push("Collected");
                                } else {
                                  status.splice(status.indexOf("Collected"), 1);
                                }
                                setFilters({ ...filters, status });
                              }}
                            >
                              Collected
                            </DropdownMenuCheckboxItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2 mt-6 lg:mt-0 w-auto ml-auto">
            <Button
              asChild
              variant="outline"
              className="w-auto min-w-[6rem] flex items-center justify-center text-sm font-medium text-white rounded-md bg-blue-600 hover:bg-white"
            >
              <Link href="/billing/new">
                <span className="!text-sm">Create</span>
                <Plus
                  strokeWidth={1.75}
                  className="!w-[1.15rem] !h-[1.15rem]"
                />
              </Link>
            </Button>
            <div className="flex flex-wrap gap-2 w-auto">
              <DropdownMenu
                open={columnsMenuOpen}
                onOpenChange={setColumnsMenuOpen}
              >
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-auto min-w-[6rem]">
                    Columns {columnsMenuOpen ? <ChevronUp /> : <ChevronDown />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="!w-[inherit]">
                  {tableInstance &&
                    tableInstance
                      .getAllColumns()
                      .filter((column: any) => column.getCanHide())
                      .map((column: any) => (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          checked={column.getIsVisible()}
                          className="capitalize"
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {labelMap[column.id] ?? column.id}
                        </DropdownMenuCheckboxItem>
                      ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="outline"
                className="w-auto min-w-[6rem]"
                onClick={() => {
                  const cols = tableInstance
                    .getAllColumns()
                    .filter((col) => col.getIsVisible());
                  const header = cols.map((col) => {
                    const withSpaces = col.id.replace(
                      /([a-z])([A-Z])/g,
                      "$1 $2"
                    );
                    const titleCased = withSpaces.replace(/\b\w/g, (c) =>
                      c.toUpperCase()
                    );
                    return titleCased;
                  });
                  const dataRows = tableInstance
                    .getRowModel()
                    .rows.map((row) => cols.map((col) => row.getValue(col.id)));
                  const ws = XLSX.utils.aoa_to_sheet([header, ...dataRows]);
                  const wb = XLSX.utils.book_new();
                  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
                  XLSX.writeFile(wb, "billing-export.xlsx");
                }}
              >
                Export <TbTableExport />
              </Button>
            </div>
          </div>
        </div>
        <Table onTableReady={setTableInstance} />
      </div>
    </Wrapper>
  );
};

export default Billing;
