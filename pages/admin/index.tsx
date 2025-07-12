"use client";
import React, { useState, useEffect, useRef } from "react";
import Wrapper from "@/components/Wrapper";
import Loading from "@/components/Loading"
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
import { encryptPost, decryptPost } from "@/lib/apiClient";
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
type TableConfig = {
  name: string;
  fields: TableField[];
  data: any[];
  table?: string;
  category?: string;
  fetchUrl?: string;
  formFields?: TableField[];
};

function GenericTable({
  config,
  clientAdmins,
  clients,
}: {
  config: TableConfig;
  clientAdmins: any[];
  clients: any[];
}) {
  const [data, setData] = useState(() =>
    (config.data || []).map((item) => ({ ...item }))
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

  const handleInvite = async (
    email: string,
    accountType: string,
    firstName?: string,
    lastName?: string,
    assignTo?: string
  ) => {
    try {
      const res = await encryptPost("/auth/invite", {
        emailToInvite: email,
        accountType,
        firstName,
        lastName,
        assignTo,
      });
      await decryptPost(res);
    } catch (err) {
      console.error(err);
    }
  };

  const reload = async () => {
    try {
      const r = await encryptPost(config.fetchUrl || "", {});
      const j = await decryptPost<any>(r);
      if (!j) return;
      const key = Object.keys(j)[0];
      setData(j[key]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    try {
      if (isEditOpen) {
        if (config.name === "User") {
          await encryptPost("/update-user", {
            userId: selected.id,
            email: form.email,
            firstName: form.first_name,
            lastName: form.last_name,
            role: form.user_type,
          });
        } else if (
          config.name === "Employee Account Manager - Client Relations"
        ) {
          await encryptPost("/update-account-manager-client-relation", {
            old_account_manager_email: selected.account_manager,
            old_client_id: selected.client,
            account_manager_email: form.account_manager,
            client_id: form.client,
          });
        } else if (
          config.name === "Client Admin - Client Technician Relations"
        ) {
          await encryptPost("/update-client-admin-technician-relation", {
            old_client_admin_email: selected.client_admin,
            old_technician_email: selected.technician,
            client_admin_email: form.client_admin,
            technician_email: form.technician,
          });
        } else {
          await encryptPost("/admin/update-record", {
            table: config.table,
            id: selected.id,
            ...form,
            category: config.category,
          });
        }
      } else {
        if (config.name === "Employee Account Manager - Client Relations") {
          await encryptPost("/create-account-manager-client-relation", {
            account_manager_email: form.account_manager,
            client_id: form.client,
          });
        } else if (
          config.name === "Client Admin - Client Technician Relations"
        ) {
          await encryptPost("/create-client-admin-technician-relation", {
            client_admin_email: form.client_admin,
            technician_email: form.technician,
          });
        } else if (config.name === "User") {
          await handleInvite(
            form.email,
            form.user_type,
            form.first_name,
            form.last_name,
            form.assign_to
          );
        } else {
          await encryptPost("/admin/create-record", {
            table: config.table,
            ...form,
            category: config.category,
          });
        }
      }
      await reload();
    } catch (err) {
      console.error(err);
    }
    setIsNewOpen(false);
    setIsEditOpen(false);
  };

  const handleDelete = async () => {
    try {
      if (config.name === "Employee Account Manager - Client Relations") {
        await encryptPost("/delete-account-manager-client-relation", {
          account_manager_email: selected.account_manager,
          client_id: selected.client,
        });
      } else if (config.name === "Client Admin - Client Technician Relations") {
        await encryptPost("/delete-client-admin-technician-relation", {
          client_admin_email: selected.client_admin,
          technician_email: selected.technician,
        });
      } else if (config.name === "User") {
        await encryptPost("/delete-user", { userId: selected.id });
      } else if (config.name !== "User") {
        await encryptPost("/admin/delete-record", {
          table: config.table,
          id: selected.id,
        });
      }
      await reload();
    } catch (err) {
      console.error(err);
    }
    setIsDeleteOpen(false);
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
          className="max-w-xs mr-2"
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
            {(config.formFields || config.fields)
              .filter((field) => {
                if (config.name === "User" && field.key === "assign_to") {
                  return form.user_type === "Client Technician";
                }
                if (config.name === "User" && field.key === "client") {
                  return form.user_type === "Employee Account Manager";
                }
                return true;
              })
              .map((field) => (
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
                        {(config.name === "User" && field.key === "assign_to"
                          ? clientAdmins.map((a) => a.email)
                          : config.name === "User" && field.key === "client"
                          ? clients.map((c) => c.company_name || c.clientName)
                          : field.options || []
                        ).map((opt: string) => (
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
  const userTypeOptions = [
    "Employee Admin",
    "Employee Account Manager",
    "Client Admin",
    "Client Technician",
  ];
  const [clientTypes, setClientTypes] = useState<any[]>([]);
  const [clientStatuses, setClientStatuses] = useState<any[]>([]);
  const [filters, setFilters] = useState<{ type: string[]; status: string[] }>({
    type: [],
    status: [],
  });
  const [email, setEmail] = useState<string>("");
  const [clientAdmins, setClientAdmins] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [configs, setConfigs] = useState<TableConfig[]>([]);
  const loaded = useRef(false);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    const load = async () => {
      try {
          setLoading(true);
        const [
          priorities,
          types,
          trades,
          statuses,
          states,
          users,
          relations,
          caRelations,
          qStatuses,
          iStatuses,
          adminList,
          clientList,
          cTypes,
          cStatuses,
          payTerms,
          me,
        ] = await Promise.all([
          decryptPost(await encryptPost("/get-project-priorities", {})),
          decryptPost(await encryptPost("/get-project-types", {})),
          decryptPost(await encryptPost("/get-project-trades", {})),
          decryptPost(await encryptPost("/get-project-statuses", {})),
          decryptPost(await encryptPost("/get-states", {})),
          decryptPost(await encryptPost("/get-users", {})),
          decryptPost(
            await encryptPost("/get-account-manager-client-relations", {})
          ),
          decryptPost(
            await encryptPost("/get-client-admin-technician-relations", {})
          ),
          decryptPost(await encryptPost("/get-quote-statuses", {})),
          decryptPost(await encryptPost("/get-invoice-statuses", {})),
          decryptPost(await encryptPost("/get-all-client-admins", {})),
          decryptPost(await encryptPost("/get-clients?size=1000", {})),
          decryptPost(await encryptPost("/get-client-types", {})),
          decryptPost(await encryptPost("/get-client-statuses", {})),
          decryptPost(await encryptPost("/get-pay-terms", {})),
        ]);
        const cfgs: TableConfig[] = [
          {
            name: "Project Priority",
            table: "project_priority",
            fields: [
              { key: "value", header: "Value" },
              { key: "color", header: "Color", isColor: true },
            ],
            data: priorities?.project_priorities || [],
            fetchUrl: "/get-project-priorities",
          },
          {
            name: "Project Type",
            table: "project_type",
            fields: [{ key: "value", header: "Value" }],
            data: types?.project_types || [],
            fetchUrl: "/get-project-types",
          },
          {
            name: "Project Trade",
            table: "project_trade",
            fields: [{ key: "value", header: "Value" }],
            data: trades?.project_trades || [],
            fetchUrl: "/get-project-trades",
          },
          {
            name: "Project Status",
            table: "status",
            category: "project",
            fields: [
              { key: "value", header: "Value" },
              { key: "color", header: "Color", isColor: true },
            ],
            data: statuses?.project_statuses || [],
            fetchUrl: "/get-project-statuses",
          },
          {
            name: "State",
            table: "state",
            fields: [{ key: "name", header: "Text" }],
            data: states?.states || [],
            fetchUrl: "/get-states",
          },
          {
            name: "Client Type",
            table: "client_type",
            fields: [{ key: "value", header: "Value" }],
            data: cTypes?.client_types || [],
            fetchUrl: "/get-client-types",
          },
          {
            name: "Pay Term",
            table: "pay_term",
            fields: [{ key: "value", header: "Value" }],
            data: payTerms?.pay_terms || [],
            fetchUrl: "/get-pay-terms",
          },
          {
            name: "User",
            table: "user",
            fields: [
              { key: "email", header: "Email" },
              { key: "firstName", header: "First Name" },
              { key: "lastName", header: "Last Name" },
              {
                key: "user_type",
                header: "User Type",
                isSelect: true,
                options: userTypeOptions,
              },
            ],
            formFields: [
              { key: "email", header: "Email" },
              { key: "first_name", header: "First Name" },
              { key: "last_name", header: "Last Name" },
              {
                key: "user_type",
                header: "User Type",
                isSelect: true,
                options: userTypeOptions,
              },
              { key: "client", header: "Client", isSelect: true },
              {
                key: "assign_to",
                header: "Assign Client Admin",
                isSelect: true,
              },
            ],
            data: (users?.users || []).map((u: any) => ({
              ...u,
              user_type: userTypeOptions[0],
              assign_to: "",
              client: "",
            })),
            fetchUrl: "/get-users",
          },
          {
            name: "Employee Account Manager - Client Relations",
            table: "account_manager_client",
            fields: [
              { key: "account_manager", header: "Account Manager" },
              { key: "client", header: "Client" },
            ],
            data: relations?.relations || [],
            fetchUrl: "/get-account-manager-client-relations",
          },
          {
            name: "Client Admin - Client Technician Relations",
            table: "client_admin_technician",
            fields: [
              { key: "client_admin", header: "Client Admin" },
              { key: "technician", header: "Client Technician" },
            ],
            data: caRelations?.relations || [],
            fetchUrl: "/get-client-admin-technician-relations",
          },
          {
            name: "Quote Status",
            table: "status",
            category: "quote",
            fields: [
              { key: "value", header: "Value" },
              { key: "color", header: "Color", isColor: true },
            ],
            data: qStatuses?.quote_statuses || [],
            fetchUrl: "/get-quote-statuses",
          },
          {
            name: "Invoice Status",
            table: "status",
            category: "invoice",
            fields: [
              { key: "value", header: "Value" },
              { key: "color", header: "Color", isColor: true },
            ],
            data: iStatuses?.invoice_statuses || [],
            fetchUrl: "/get-invoice-statuses",
          },
        ];
        setConfigs(cfgs);
        setClientAdmins(adminList?.client_admins || []);
        setClients(clientList?.clients || []);
        setClientTypes(cTypes?.client_types || []);
        setClientStatuses(cStatuses?.client_statuses || []);
        setFilters({
          type: (cTypes?.client_types || []).map((v: any) => v.value),
          status: (cStatuses?.client_statuses || []).map((v: any) => v.value),
        });
        setEmail(me?.email || "");
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  if (loading) return <Loading />

  return (
    <Wrapper title="Admin">
      <div className="mt-5">
        {configs.map((cfg) => (
          <GenericTable
            key={cfg.name}
            config={cfg}
            clientAdmins={clientAdmins}
            clients={clients}
          />
        ))}
      </div>
    </Wrapper>
  );
}
