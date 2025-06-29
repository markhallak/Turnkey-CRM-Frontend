"use client";
import React, { useState } from "react";
import Wrapper from "@/components/Wrapper";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as twColors from "tailwindcss/colors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Edit2,
  Trash2,
  Plus,
} from "lucide-react";
import { serverUrl } from "@/lib/config";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type TableField = {
  key: string;
  header: string;
  isColor?: boolean;
  isSelect?: boolean;
  options?: string[];
};
type TableConfig = { name: string; fields: TableField[]; data: any[] };

function GenericTable({ config }: { config: TableConfig }) {
  const [data, setData] = useState(() =>
    config.data.map((item) => ({ ...item }))
  );
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState<any>({});
  const [colorQuery, setColorQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const columns: ColumnDef<any>[] = [
    ...config.fields.map((field) => ({
      id: field.key,
      accessorKey: field.key,
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="px-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {field.header}
          <span className="ml-1">
            {column.getIsSorted() === "asc" ? (
              <ArrowUp size={16} />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown size={16} />
            ) : (
              <ArrowUpDown size={16} />
            )}
          </span>
        </Button>
      ),
      cell: (info) => {
        const value = info.getValue() as string;
        if (field.isColor) {
          const [group, shade] = value.split("-");
          const hex =
            typeof (twColors as any)[group] === "object"
              ? (twColors as any)[group][shade]
              : undefined;
          return (
            <div
              style={{ backgroundColor: hex }}
              className="text-white text-center py-1 rounded transition-opacity duration-200 hover:opacity-80"
            >
              {value}
            </div>
          );
        }
        return <div>{value}</div>;
      },
    })),
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setSelected(row.original);
              setForm(row.original);
              setIsEditOpen(true);
            }}
          >
            <Edit2 size={16} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setSelected(row.original);
              setIsDeleteOpen(true);
            }}
          >
            <Trash2 size={16} />
          </Button>
          {config.name === "User" && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleInvite(row.original.email, row.original.user_type)}
            >
              Invite
            </Button>
          )}
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleSave = () => {
    if (isEditOpen) {
      setData(
        data.map((item) =>
          item.id === selected.id ? { ...form, id: selected.id } : item
        )
      );
    } else {
      const newItem = { ...form, id: Date.now().toString() };
      setData([...data, newItem]);
      if (config.name === "User") {
        handleInvite(form.email, form.user_type);
      }
    }
    setIsNewOpen(false);
    setIsEditOpen(false);
  };

  const handleDelete = () => {
    setData(data.filter((item) => item.id !== selected.id));
    setIsDeleteOpen(false);
  };

  const handleInvite = async (email: string, accountType: string) => {
    try {
      await fetch(`${serverUrl}/auth/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailToInvite: email, accountType }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const allColors = Object.entries(twColors)
    .filter(([group]) => group !== "default")
    .flatMap(([group, shades]) =>
      shades && typeof shades === "object"
        ? Object.keys(shades)
            .filter((shade) => shade !== "DEFAULT")
            .map((shade) => `${group}-${shade}`)
        : []
    );

  return (
    <div className="w-full pb-8">
      <h2 className="text-xl font-semibold mb-4">{config.name}</h2>
      <div className="flex justify-between mb-2">
        <Input
          placeholder={`Search ${config.name.toLowerCase()}...`}
          value={
            (table
              .getColumn(config.fields[0].key)
              ?.getFilterValue() as string) ?? ""
          }
          onChange={(e) =>
            table
              .getColumn(config.fields[0].key)
              ?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
        <Button
          onClick={() => {
            setForm({});
            setIsNewOpen(true);
          }}
        >
          <Plus className="mr-2" size={16} />
          New
        </Button>
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={`px-4 py-2 text-center ${
                      header.id === "actions"
                        ? "w-12"
                        : header.id === "color"
                        ? "w-60"
                        : ""
                    }`}
                  >
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
                      key={cell.id}
                      className={`px-4 py-2 text-center truncate ${
                        cell.column.id === "color" ? "w-24" : ""
                      }`}
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

      <Dialog
        open={isNewOpen || isEditOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsNewOpen(false);
            setIsEditOpen(false);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditOpen ? `Edit ${config.name}` : `New ${config.name}`}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {config.fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium mb-1">
                    {field.header}
                  </label>
                  {field.isSelect ? (
                    <Select
                      onValueChange={(val) =>
                        setForm({ ...form, [field.key]: val })
                      }
                      defaultValue={form[field.key] || ""}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={`Select ${field.header}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : field.isColor ? (
                    <div className="relative">
                      <Button
                        variant="outline"
                        className="w-full text-left"
                        onClick={() => setDropdownOpen((o) => !o)}
                      >
                        {form[field.key] || "Select color"}
                      </Button>
                      {dropdownOpen && (
                        <div className="absolute z-10 mt-1 px-2 w-full bg-white border rounded shadow">
                          <Input
                            placeholder="Search colors..."
                            value={colorQuery}
                            onChange={(e) => setColorQuery(e.target.value)}
                            className="p-2 my-2"
                          />
                          <div className="max-h-40 overflow-y-auto">
                            {allColors
                              .filter((c) => c.includes(colorQuery))
                              .map((c) => {
                                const [g, s] = c.split("-");
                                const hex =
                                  typeof (twColors as any)[g] === "object"
                                    ? (twColors as any)[g][s]
                                    : undefined;
                                return (
                                  <div
                                    key={c}
                                    style={{ backgroundColor: hex }}
                                    className="p-2 cursor-pointer my-1 text-white hover:opacity-80 rounded"
                                    onClick={() => {
                                      setForm({ ...form, [field.key]: c });
                                      setDropdownOpen(false);
                                    }}
                                  >
                                    {c}
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Input
                      value={form[field.key] || ""}
                      onChange={(e) =>
                        setForm({ ...form, [field.key]: e.target.value })
                      }
                    />
                  )}
                </div>
              ))}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsNewOpen(false);
                setIsEditOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isDeleteOpen}
        onOpenChange={(open) => {
          if (!open) setIsDeleteOpen(false);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {config.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">Are you sure you want to delete this item?</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AdminPage() {
  const baseConfigs: TableConfig[] = [
    {
      name: "Project Priority",
      fields: [
        { key: "value", header: "Value" },
        { key: "color", header: "Color", isColor: true },
      ],
      data: [
        { id: "1", value: "High", color: "red-500" },
        { id: "2", value: "Low", color: "green-500" },
      ],
    },
    {
      name: "Project Type",
      fields: [{ key: "value", header: "Value" }],
      data: [
        { id: "1", value: "Residential" },
        { id: "2", value: "Commercial" },
      ],
    },
    {
      name: "Project Trade",
      fields: [{ key: "value", header: "Value" }],
      data: [
        { id: "1", value: "Electrical" },
        { id: "2", value: "Plumbing" },
      ],
    },
    {
      name: "Project Status",
      fields: [
        { key: "value", header: "Value" },
        { key: "color", header: "Color", isColor: true },
      ],
      data: [
        { id: "1", value: "Open", color: "blue-500" },
        { id: "2", value: "Closed", color: "gray-500" },
      ],
    },
    {
      name: "State",
      fields: [{ key: "text", header: "Text" }],
      data: [
        { id: "1", text: "New York" },
        { id: "2", text: "California" },
      ],
    },
    {
      name: "User",
      fields: [
        { key: "email", header: "Email" },
        { key: "first_name", header: "First Name" },
        { key: "last_name", header: "Last Name" },
      ],
      data: [
        {
          id: "1",
          email: "alice@example.com",
          first_name: "Alice",
          last_name: "Wonder",
        },
        {
          id: "2",
          email: "bob@example.com",
          first_name: "Bob",
          last_name: "Builder",
        },
      ],
    },
    {
      name: "Employee Account Manager - Client Relations",
      fields: [
        { key: "account_manager", header: "Account Manager" },
        { key: "client", header: "Client" },
      ],
      data: [
        { id: "1", account_manager: "bob@example.com", client: "Acme" },
      ],
    },
    {
      name: "Quote Status",
      fields: [
        { key: "value", header: "Value" },
        { key: "color", header: "Color", isColor: true },
      ],
      data: [
        { id: "1", value: "Pending", color: "amber-500" },
        { id: "2", value: "Approved", color: "green-500" },
      ],
    },
    {
      name: "Invoice Status",
      fields: [
        { key: "value", header: "Value" },
        { key: "color", header: "Color", isColor: true },
      ],
      data: [
        { id: "1", value: "Unpaid", color: "red-500" },
        { id: "2", value: "Paid", color: "emerald-500" },
      ],
    },
  ];

  const userTypeOptions = [
    "Employee Admin",
    "Employee Account Manager",
    "Client Admin",
    "Client Technician",
  ];

  const configs = baseConfigs.map((cfg) => {
    if (cfg.name === "User") {
      return {
        ...cfg,
        fields: [
          ...cfg.fields,
          {
            key: "user_type",
            header: "User Type",
            isSelect: true,
            options: userTypeOptions,
          },
        ],
        data: cfg.data.map((item) => ({
          ...item,
          user_type: userTypeOptions[0],
        })),
      };
    }

    return cfg;
  });

  return (
    <Wrapper title="Admin">
      <div className="mt-5">
        {configs.map((cfg) => (
          <GenericTable key={cfg.name} config={cfg} />
        ))}
      </div>
    </Wrapper>
  );
}
