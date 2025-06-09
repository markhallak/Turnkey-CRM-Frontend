"use client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import * as React from "react";
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
  Table as UiTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GoKebabHorizontal } from "react-icons/go";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { projectsData as data, projectsData } from "@/lib/constants";
import { useRouter } from "next/router";

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

const labelMap: Record<string, string> = {
  poNumber: "PO Number",
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
].map((key) => {
  const header = ({ column, table }: any) => {
    const visible = table.getVisibleLeafColumns();
    const idx = visible.findIndex((col) => col.id === column.id);
    const isLast = idx === visible.length - 1;
    const isFirst = idx === 0;

    return (
      <div
        className={`flex items-center gap-2 capitalize whitespace-nowrap pr-2 ${
          isLast ? "pr-8" : ""
        } ${isFirst ? "pl-8" : ""}`}
      >
        {labelMap[key] ?? key}
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
    );
  };
  if (key === "status") {
    return {
      accessorKey: "status",
      header,
      sortingFn: (rowA, rowB, columnId) => {
        const a = String(rowA.getValue(columnId)).toLowerCase();
        const b = String(rowB.getValue(columnId)).toLowerCase();
        return a.localeCompare(b);
      },
      cell: ({ getValue }: any) => {
        const status = getValue<string>();
        const colors = {
          Open: { base: "bg-green-500", hover: "hover:bg-green-600" },
          Completed: { base: "bg-yellow-500", hover: "hover:bg-yellow-600" },
          "Quote Submitted": { base: "bg-red-500", hover: "hover:bg-red-600" },
          default: { base: "bg-gray-200", hover: "hover:bg-gray-300" },
        };

        return (
          <Badge
            variant="default"
            className={`
      ${colors[status]?.base || colors.default.base}
      ${colors[status]?.hover || colors.default.hover}
      transition-colors duration-400 text-white ease-in-out
    `}
          >
            {status}
          </Badge>
        );
      },
    };
  }
  return {
    accessorKey: key,
    header,
    sortingFn: (rowA, rowB, columnId) => {
      const a = String(rowA.getValue(columnId)).toLowerCase();
      const b = String(rowB.getValue(columnId)).toLowerCase();
      return a.localeCompare(b);
    },
    cell: ({ getValue }: any) => (
      <div
        className={
          key === "address"
            ? "w-40 whitespace-pre-wrap break-words"
            : "truncate"
        }
      >
        {getValue()}
      </div>
    ),
  };
});

type ProjectsTableProps = {
  onTableReady?: (table: any) => void;
};

function ProjectsTable({ onTableReady }: ProjectsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [pageSize] = React.useState(10);
  const [openRowId, setOpenRowId] = React.useState<string | null>(null);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: { sorting, columnVisibility },
    initialState: { pagination: { pageSize } },
  });
  React.useEffect(() => {
    onTableReady?.(table);
  }, [table, onTableReady]);
  const router = useRouter();
  return (
    <div className="w-full pb-28">
      <div className="rounded-md border !w-full !overflow-x-auto !min-w-0">
        <UiTable className="min-w-full table-auto">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-left py-2">
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
              table.getRowModel().rows.map((row) => {
                const isOpen = openRowId === row.id;

                return (
                  <TableRow key={row.id} className="group">
                    {row.getVisibleCells().map((cell, idx, cells) => {
                      const isFirst = idx === 0;
                      const isLast = idx === cells.length - 1;
                      return (
                        <TableCell
                          key={cell.id}
                          className={`
                  ${isFirst ? "!pl-10" : ""}
                  ${isLast ? "!pr-8" : ""}
                  py-3.5 pr-8 cursor-pointer capitalize`}
                          onClick={() =>
                            router.push(
                              "/projects/view/" +
                                projectsData.find(
                                  (project) =>
                                    project.id === parseInt(row.id) + 1
                                )?.poNumber
                            )
                          }
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                    <TableCell className="sticky right-0 w-0 p-0 border-0 bg-transparent z-10 overflow-visible">
                      <div
                        className={`absolute right-2 top-1/2 -translate-y-1/2 flex space-x-0.5
                         ${
                           isOpen
                             ? "opacity-100 pointer-events-auto"
                             : "opacity-0 pointer-events-none"
                         }
                         group-hover:opacity-100 group-hover:pointer-events-auto`}
                      >
                        <DropdownMenu
                          open={isOpen}
                          onOpenChange={(open) =>
                            setOpenRowId(open ? row.id : null)
                          }
                        >
                          <DropdownMenuTrigger asChild>
                            <button className="shadow-sm border bg-white rounded-md ml-5 mr-2 p-1.5">
                              <GoKebabHorizontal size={15} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent side="bottom" align="end">
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </UiTable>
      </div>
      <div className="flex items-center justify-center mt-4">
        <div className="flex gap-2">
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
                  onClick={() => table.nextPage()}
                  aria-disabled={!table.getCanNextPage()}
                  className={`cursor-pointer text-gray-600 ${
                    !table.getCanNextPage()
                      ? "opacity-50 pointer-events-none cursor-not-allowed"
                      : ""
                  }`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}

export default ProjectsTable;
