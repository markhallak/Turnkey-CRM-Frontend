"use client";

import { useEffect, useState } from "react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
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
    ChevronUp,
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

import { encryptPost, decryptPost } from "@/lib/apiClient";

const mapData = (rows: any[]): DocumentData[] =>
  rows.map((r) => ({
    title: r.title,
    type: r.document_type,
    dateUploaded: r.date_uploaded,
  }));

export type DocumentData = {
    title: string;
    type: string;
    dateUploaded: string;
};

export const columns: ColumnDef<DocumentData>[] = [
    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => <div>{row.getValue("title")}</div>,
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => <div>{row.getValue("type")}</div>,
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
                            // Open PDF viewer here
                            console.log(row);
                        }}
                    >
                        View Document
                    </DropdownMenuItem>
                    <DropdownMenuItem>Download</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-500 data-[highlighted]:bg-red-500/30 data-[highlighted]:text-red-700">Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];

function PaperworkTab({ clientId }: { clientId: string }) {
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
        initialState: { pagination: { pageSize } }
    });

    const load = async (reset = false, q = query) => {
        try {
            const url = `/fetch-client-onboarding-documents?client_id=${clientId}&size=${pageSize}` +
                (cursor.ts && !reset ? `&last_seen_created_at=${cursor.ts}&last_seen_id=${cursor.id}` : '') +
                (q && q.length >= 3 ? `&q=${encodeURIComponent(q)}` : '');
            const r = await encryptPost(url, {});
            const j = await decryptPost<any>(r);
            if (j) {
                setCursor({ ts: j.last_seen_created_at || undefined, id: j.last_seen_id || undefined });
                const rows = mapData(j.documents);
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
  <div className="flex flex-wrap items-center gap-2 py-4">
    <Input
      placeholder="Filter titles..."
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
        <DropdownMenuContent align="end" className="w-auto lg:min-w-[150px]">
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
              <TableHead key={header.id} className="text-left px-4 py-2">
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
                <TableCell key={cell.id} className="text-left px-4 py-2 truncate">
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

  <div className="flex items-center justify-center mt-4">
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => table.previousPage()}
            aria-disabled={!table.getCanPreviousPage()}
            className={`cursor-pointer text-gray-600 ${
              !table.getCanPreviousPage() ? "opacity-50 pointer-events-none cursor-not-allowed" : ""
            }`}
          />
        </PaginationItem>

        {Array.from({
          length: Math.ceil(data.length / table.getState().pagination.pageSize),
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

export default PaperworkTab;