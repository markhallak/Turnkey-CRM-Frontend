"use client";
import Wrapper from "@/components/Wrapper";
import Link from "next/link";
import React, { useState, useEffect } from "react";
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
import Table, { DocumentData } from "@/components/Projects/Table";
import { encryptPost, decryptPost } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { TbTableExport } from "react-icons/tb";
import * as XLSX from "xlsx";
import { useAuth } from "@/lib/authContext";

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState("");
    const { isClient } = useAuth();
  const [filters, setFilters] = useState({ priority: [] as string[], type: [] as string[], status: [] as string[] });
  const [projects, setProjects] = useState<DocumentData[]>([]);
  const [cursor, setCursor] = useState<{ ts?: string; id?: string }>({});
  const [statuses, setStatuses] = useState<any[]>([]);
  const [priorities, setPriorities] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [trades, setTrades] = useState<any[]>([]);
  const [tableInstance, setTableInstance] = useState<any>(null);
  const [columnsMenuOpen, setColumnsMenuOpen] = useState(false);
  const labelMap: Record<string, string> = {
    poNumber: "PO Number",
  };

  useEffect(() => {
    const load = async () => {
      try {
        let r = await encryptPost("/get-project-statuses", {});
        const s = await decryptPost<{ project_statuses: any[] }>(r);
        setStatuses(s?.project_statuses || []);
        r = await encryptPost("/get-project-priorities", {});
        const p = await decryptPost<{ project_priorities: any[] }>(r);
        setPriorities(p?.project_priorities || []);
        r = await encryptPost("/get-project-types", {});
        const t = await decryptPost<{ project_types: any[] }>(r);
        setTypes(t?.project_types || []);
        r = await encryptPost("/get-project-trades", {});
        const tr = await decryptPost<{ project_trades: any[] }>(r);
        setTrades(tr?.project_trades || []);
        const pr = await encryptPost("/get-projects", { size: 20 });
        const pj = await decryptPost<any>(pr);
        if (pj) {
          setProjects(
            pj.projects.map((r: any) => ({
              poNumber: r.po_number,
              client: r.company_name,
              priority: r.priority_value,
              type: r.type_value,
              address: r.address,
              trade: r.trade_value,
              status: r.status_value,
              nte: r.nte,
              assignee: r.assignee_name,
            }))
          );
          setCursor({ ts: pj.last_seen_created_at || undefined, id: pj.last_seen_id || undefined });
        }
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  return (
    <Wrapper title="Projects">
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
                          Priority
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            {priorities.map((p) => (
                              <DropdownMenuCheckboxItem
                                key={p.id}
                                checked={filters.priority.includes(String(p.id))}
                                textValue={String(p.id)}
                                onCheckedChange={(isChecked) => {
                                  const priority = [...filters.priority];
                                  if (isChecked) priority.push(String(p.id));
                                  else priority.splice(priority.indexOf(String(p.id)), 1);
                                  setFilters({ ...filters, priority });
                                }}
                              >
                                {p.value}
                              </DropdownMenuCheckboxItem>
                            ))}
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
            {!isClient && (
            <Button
              asChild
              variant="outline"
              className="w-auto min-w-[6rem] flex items-center justify-center text-sm font-medium text-white rounded-md bg-blue-600 hover:bg-white"
            >
              <Link href="/projects/new">
                <span className="!text-sm">Create</span>
                <Plus
                  strokeWidth={1.75}
                  className="!w-[1.15rem] !h-[1.15rem]"
                />
              </Link>
            </Button>
            )}
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
                  XLSX.writeFile(wb, "projects-export.xlsx");
                }}
              >
                Export <TbTableExport />
              </Button>
            </div>
          </div>
        </div>

        <Table data={projects} onTableReady={setTableInstance} />
      </div>
    </Wrapper>
  );
};

export default Projects;
