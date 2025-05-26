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

export type DocumentData = {
  portalName: string;
  url: string;
  username: string;
  password: string;
  dateUploaded: string;
};

const data: DocumentData[] = [
  {
    portalName: "Trillium",
    url: "https://partners.mytrillium.com/#/dashboard",
    username: "Wang",
    password: "wang1234",
    dateUploaded: "08/12/2024",
  },
  {
    portalName: "Umbrava",
    url: "https://partners.mytrillium.com/#/dashboard",
    username: "info@wang.com",
    password: "1738",
    dateUploaded: "09/14/2025",
  },
];

export const columns: ColumnDef<DocumentData>[] = [
  {
    accessorKey: "portalName",
    header: ({ column }) => (
      <div
      role="button"
      tabIndex={0}
      className="flex items-center px-0 py-0 cursor-pointer hover:bg-gray-50 hover:text-inherit"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
        Portal Name
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
    cell: ({ row }) => <div className="w-40">{row.getValue("portalName")}</div>,
  },
  {
    header: "URL",
    accessorKey: "url",
    cell: ({ row }) => (
      <a href={row.getValue("url")} target="_blank" rel="noopener noreferrer">
        {row.getValue("url")}
      </a>
    ),
  },
  {
    accessorKey: "username",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="px-0 hover:bg-gray-50 hover:text-inherit"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Username
        <Button variant="ghost" size="icon">
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
      </Button>
    ),
    sortingFn: (rowA, rowB, columnId) => {
      const a = String(rowA.getValue(columnId)).toLowerCase()
      const b = String(rowB.getValue(columnId)).toLowerCase()
      return a.localeCompare(b)
    },
    cell: ({ row }) => <div>{row.getValue("username")}</div>,
  },
  {
    accessorKey: "password",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="px-0 hover:bg-gray-50 hover:text-inherit"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Password
        <Button variant="ghost" size="icon">
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
      </Button>
    ),
    sortingFn: (rowA, rowB, columnId) => {
      const a = String(rowA.getValue(columnId)).toLowerCase()
      const b = String(rowB.getValue(columnId)).toLowerCase()
      return a.localeCompare(b)
    },
    cell: ({ row }) => <div>{row.getValue("password")}</div>,
  },
  {
    accessorKey: "dateUploaded",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="px-0 hover:bg-gray-50 hover:text-inherit"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date Uploaded
        <Button variant="ghost" size="icon">
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
      </Button>
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
            View Password
          </DropdownMenuItem>
          <DropdownMenuItem>Download</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

function PasswordsTab() {
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
          placeholder="Filter portal name..."
          value={
            (table.getColumn("portalName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("portalName")?.setFilterValue(event.target.value)
          }
          className="lg:max-w-sm col-span-2"
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
            Add Password
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

export default PasswordsTab;
