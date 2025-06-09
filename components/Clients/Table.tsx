"use client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
  Table,
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
import { clientsData as data } from "@/lib/constants";
import { useRouter } from "next/router";
import CurrencyFormat from "react-currency-format";

export type DocumentData = {
  id: number;
  clientName: string;
  status: "Compliant and Active" | "Compliant and Non-active";
  type: "commercial" | "residential";
  totalRevenue: number;
};

const labelMap: Record<string, string> = {
  clientName: "Client Name",
  totalRevenue: "Total Revenue",
};

export const columns: ColumnDef<DocumentData>[] = [
  "clientName",
  "status",
  "type",
  "totalRevenue",
].map((key) => ({
  accessorKey: key,
  header: ({ column, table }) => {
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
  },
  sortingFn: (rowA, rowB, columnId) => {
    const a = String(rowA.getValue(columnId)).toLowerCase();
    const b = String(rowB.getValue(columnId)).toLowerCase();
    return a.localeCompare(b);
  },
  cell: ({ getValue }) =>
    key === "totalRevenue" ? (
      <div className="truncate capitalize">
        <CurrencyFormat
          value={getValue() as number}
          displayType="text"
          thousandSeparator
          prefix="$"
        />
      </div>
    ) : (
      <div className="truncate capitalize">{getValue() as string}</div>
    ),
}));

type ClientsTableProps = {
  onTableReady?: (table: any) => void;
};

function ClientsTable({ onTableReady }: ClientsTableProps) {
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
    state: {
      sorting,
      columnVisibility,
    },
    initialState: { pagination: { pageSize } },
  });

  React.useEffect(() => {
    onTableReady?.(table);
  }, [table, onTableReady]);
  const router = useRouter();
  return (
    <div className="w-full pb-28">
      <div className="rounded-md border overflow-x-auto">
        <Table className="w-full min-w-[600px]">
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
                          className={`${isFirst ? "!pl-10" : ""}
                  ${isLast ? "!pr-8" : ""} py-3.5 cursor-pointer capitalize`}
                          onClick={() =>
                            router.push(
                              "/clients/view/" +
                                data.find(
                                  (project) =>
                                    project.id === parseInt(row.id) + 1
                                )?.clientName
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
                            <DropdownMenuItem className="data-[highlighted]:bg-red-600 data-[highlighted]:text-black text-red-600">Delete</DropdownMenuItem>
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
        </Table>
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

export default ClientsTable;
