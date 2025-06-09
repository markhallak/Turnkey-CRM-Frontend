"use client";

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
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const data: DocumentData[] = [
  { title: "W9.PDF", type: "W9", dateUploaded: "08/12/2024" },
  { title: "COImcd.pdf", type: "Sample COI", dateUploaded: "09/14/2025" },
  { title: "1293.jpeg", type: "License", dateUploaded: "09/14/2025" },
  { title: "asda.PDF", type: "Certification", dateUploaded: "08/12/2024" },
  { title: "Assessment 2.jpeg", type: "Rate Card", dateUploaded: "09/14/2025" },
  { title: "Quote 5412.pdf", type: "Logo", dateUploaded: "09/14/2025" },
  {
    title: "Assessment 1.jpeg",
    type: "E-Brochure",
    dateUploaded: "08/12/2024",
  },
  {
    title: "Assessment 2.jpeg",
    type: "Drivers License",
    dateUploaded: "09/14/2025",
  },
  { title: "Quote 5412.pdf", type: "Proposal", dateUploaded: "09/14/2025" },
  { title: "Quote 5412.pdf", type: "MSA", dateUploaded: "09/14/2025" },
];

export type DocumentData = {
  title: string;
  type: string;
  dateUploaded: string;
};

export const columns: ColumnDef<DocumentData>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <div
      role="button"
      tabIndex={0}
      className="flex items-center px-0 py-0 cursor-pointer hover:bg-gray-50 hover:text-inherit"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
        Title
        <Button variant="ghost" size="icon" className="mx-1">
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
    cell: ({ row }) => <div>{row.getValue("title")}</div>,
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <div
      role="button"
      tabIndex={0}
      className="flex items-center px-0 py-0 cursor-pointer hover:bg-gray-50 hover:text-inherit"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
        Type
        <Button variant="ghost" size="icon" className="mx-1">
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
    cell: ({ row }) => <div>{row.getValue("type")}</div>,
  },
  {
    accessorKey: "dateUploaded",
    header: ({ column }) => (
      <div
      role="button"
      tabIndex={0}
      className="flex items-center px-0 py-0 cursor-pointer hover:bg-gray-50 hover:text-inherit"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
        Date Uploaded
        <Button variant="ghost" size="icon" className="mx-1">
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
    cell: ({ row }) => <div>{row.getValue("dateUploaded")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              console.log(row);
            }}
          >
            View Document
          </DropdownMenuItem>
          <DropdownMenuItem>Download</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="data-[highlighted]:bg-red-600 data-[highlighted]:text-black text-red-600">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

function DocumentsTab() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

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
  });
  return (
    <div className="w-full pb-28 px-1">
      <div className="flex flex-col md:flex-row justify-between py-4 space-y-2 md:space-y-0">
        <Input
          placeholder="Filter titles..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="lg:max-w-sm flex-1"
        />
        <div className="flex items-center space-x-2 md:ml-4 mt-2 md:mt-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="lg:ml-auto lg:min-w-[150px] w-full lg:w-fit"
              >
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-auto lg:min-w-[150px]"
            >
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" className="w-full">
            Add Document
          </Button>
        </div>
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table className="w-full min-w-[600px]">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead className="text-left px-4 py-2" key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
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
                <TableRow key={row.id} className="border-b last:border-b-0">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      className="text-left px-4 py-2 truncate"
                      key={cell.id}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
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
    </div>
  );
}

export default DocumentsTab;
