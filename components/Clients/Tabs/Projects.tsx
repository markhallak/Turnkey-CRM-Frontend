"use client";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

import { useEffect, useState } from "react";
import {
    ColumnDef,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { ArrowUpDown, ChevronUp, ChevronDown, ArrowUp, ArrowDown } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { encryptPost, decryptPost } from "@/lib/apiClient";

const mapData = (rows: any[]): DocumentData[] =>
  rows.map((r) => ({
    poNumber: r.project_id,
    client: r.business_name,
    priority: "",
    type: "",
    address: "",
    trade: "",
    status: r.status_value,
    nte: "",
    assignee: "",
  }));
import { TbTableExport } from "react-icons/tb";
import { useRouter } from "next/router";
import { Input } from "@/components/ui/input";

export type DocumentData = {
    poNumber: string;
    client: string;
    priority: string;
    type: string;
    address: string;
    trade: string;
    status: string;
    nte: string;
    assignee: string;
};

export const columns: ColumnDef<DocumentData>[] = [
    "poNumber",
    "client",
    "priority",
    "type",
    "address",
    "trade",
    "status",
    "nte",
    "assignee",
].map((key) => ({
    accessorKey: key,
    header: ({ column }) => (
        <div className="flex items-center gap-2">
            {key.charAt(0).toUpperCase() + key.slice(1)}
            <Button
                variant="ghost"
                size="icon"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                {column.getIsSorted() ? (
                    column.getIsSorted() === "asc" ? (
                        <ArrowUp size={16} />
                    ) : (
                        <ArrowDown size={16} />
                    )
                ) : (
                    <ArrowUpDown size={16} />
                )}
            </Button>
        </div>
    ),
    sortingFn: (rowA, rowB, columnId) => {
      const a = String(rowA.getValue(columnId)).toLowerCase()
      const b = String(rowB.getValue(columnId)).toLowerCase()
      return a.localeCompare(b)
    },
    cell: ({ getValue }) => (
        <div
            className={
                key === "address" ? "w-40 whitespace-pre-wrap break-words" : "truncate"
            }
        >
            {/* @ts-expect-error: "" */}
            {getValue()}
        </div>
    ),
}));

function ProjectsTab({ clientId }: { clientId: string }) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [pageSize] = useState(10);
    const [columnsMenuOpen, setColumnsMenuOpen] = useState(false);
    const [data, setData] = useState<DocumentData[]>([]);
    const [cursor, setCursor] = useState<{ ts?: string; id?: string }>({});
    const [query, setQuery] = useState("");
    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnVisibility,
        },
        initialState: { pagination: { pageSize } },
    });

    const router = useRouter();

    const load = async (reset = false, q = query) => {
        try {
            const url = `/fetch-client-projects?client_id=${clientId}&size=${pageSize}` +
                (cursor.ts && !reset ? `&last_seen_created_at=${cursor.ts}&last_seen_id=${cursor.id}` : '') +
                (q && q.length >= 3 ? `&q=${encodeURIComponent(q)}` : '');
            const r = await encryptPost(url, {});
            const j = await decryptPost<any>(r);
            if (j) {
                setCursor({ ts: j.last_seen_created_at || undefined, id: j.last_seen_id || undefined });
                const rows = mapData(j.projects);
                setData(reset ? rows : [...data, ...rows]);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (clientId) load(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clientId]);

    return (
        <div className="w-full">
  {/* search and controls */}
  <div className="flex flex-wrap items-center gap-2 py-4">
    <Input
      placeholder="Filter phone number..."
      value={query}
      onChange={(event) => {
        const v = event.target.value;
        setQuery(v);
        if (v.length >= 3 || v.length === 0) load(true, v);
      }}
      className="flex-grow lg:flex-none lg:w-[30%]"
    />

    <div className="flex gap-2 ml-auto w-full lg:w-auto">
      <DropdownMenu open={columnsMenuOpen} onOpenChange={setColumnsMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full lg:w-fit lg:min-w-[150px]">
            Columns {columnsMenuOpen ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[inherit]">
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="outline" className="w-full lg:w-fit">
        Export <TbTableExport />
      </Button>
    </div>
  </div>

  {/* table */}
  <div className="rounded-md border overflow-x-auto">
    <Table className="w-full min-w-[600px]">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id} className="text-left px-4 py-2">
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className="px-4 py-3.5 cursor-pointer"
                  onClick={() =>
                    router.push(
                      "/projects/view/" +
                        projectsData.find(
                          (project) => project.id === parseInt(row.id) + 1
                        )?.poNumber
                    )
                  }
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>

  {/* pagination */}
  <div className="flex items-center justify-center mt-4">
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => table.previousPage()}
            aria-disabled={!table.getCanPreviousPage()}
            className={`cursor-pointer text-gray-600 ${
              !table.getCanPreviousPage()
                ? "opacity-50 pointer-events-none cursor-not-allowed"
                : ""
            }`}
          />
        </PaginationItem>

        {Array.from({
          length: Math.ceil(
            data.length / table.getState().pagination.pageSize
          ),
        }).map((_, index) => (
          <PaginationItem key={index}>
            <PaginationLink
              onClick={() => table.setPageIndex(index)}
              className={`cursor-pointer ${
                table.getState().pagination.pageIndex === index
                  ? "bg-gray-200 text-gray-600"
                  : ""
              }`}
            >
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() => {
              table.nextPage();
              load();
            }}
            aria-disabled={!cursor.ts}
            className={`cursor-pointer text-gray-600 ${
              !cursor.ts ? "opacity-50 pointer-events-none cursor-not-allowed" : ""
            }`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  </div>
</div>

    );
}

export default ProjectsTab;