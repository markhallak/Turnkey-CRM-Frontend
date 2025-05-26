export const projectsData: {
  id: number;
  poNumber: string;
  client: string;
  priority: string;
  type: string;
  address: string;
  trade: string;
  status: string;
  nte: string;
  assignee: string;
}[] = [
  {
    id: 1,
    poNumber: "2345-643-234",
    client: "Spivek",
    priority: "P1 - Emergency",
    type: "commercial",
    address: "123 Main, church street, Suite Lane, Suite 330m Park, CL",
    trade: "Electrical",
    status: "Open",
    nte: "$135",
    assignee: "Sams Shakur",
  },
  {
    id: 2,
    poNumber: "1234-567-890",
    client: "John Doe",
    priority: "P2 - Same Day",
    type: "commercial",
    address: "456 Elm St",
    trade: "HVAC",
    status: "Quote Submitted",
    nte: "$514",
    assignee: "Kristin Mars",
  },
  {
    id: 3,
    poNumber: "5678-123-456",
    client: "Alice Smith",
    priority: "P3 - Standard",
    type: "residential",
    address: "789 Pine St",
    trade: "Plumbing",
    status: "Completed",
    nte: "$200",
    assignee: "Mike Johnson",
  },
  {
    id: 4,
    poNumber: "8765-432-109",
    client: "Bob Johnson",
    priority: "P1 - Emergency",
    type: "residential",
    address: "321 Oak St",
    trade: "Electrical",
    status: "Quote Submitted",
    nte: "$456",
    assignee: "Linda Brown",
  },
  {
    id: 5,
    poNumber: "4567-890-123",
    client: "Jane Doe",
    priority: "P2 - Same Day",
    type: "commercial",
    address: "654 Oak St",
    trade: "Plumbing",
    status: "Open",
    nte: "$321",
    assignee: "Sarah Smith",
  },
  {
    id: 6,
    poNumber: "9876-543-210",
    client: "Tom Smith",
    priority: "P3 - Standard",
    type: "residential",
    address: "987 Main St",
    trade: "Heating",
    status: "Completed",
    nte: "$123",
    assignee: "Jane Doe",
  },
  {
    id: 7,
    poNumber: "7654-321-098",
    client: "Linda Brown",
    priority: "P1 - Emergency",
    type: "residential",
    address: "210 Elm St",
    trade: "Heating",
    status: "Quote Submitted",
    nte: "$654",
    assignee: "Sarah Smith",
  },
  {
    id: 8,
    poNumber: "1234-567-890",
    client: "John Doe",
    priority: "P2 - Same Day",
    type: "commercial",
    address: "456 Elm St",
    trade: "HVAC",
    status: "Quote Submitted",
    nte: "$514",
    assignee: "Kristin Mars",
  },
  {
    id: 9,
    poNumber: "5678-123-456",
    client: "Alice Smith",
    priority: "P3 - Standard",
    type: "residential",
    address: "789 Pine St",
    trade: "Plumbing",
    status: "Completed",
    nte: "$200",
    assignee: "Mike Johnson",
  },
  {
    id: 10,
    poNumber: "8765-432-109",
    client: "Bob Johnson",
    priority: "P1 - Emergency",
    type: "residential",
    address: "321 Oak St",
    trade: "Electrical",
    status: "Quote Submitted",
    nte: "$456",
    assignee: "Linda Brown",
  },
  {
    id: 11,
    poNumber: "4567-890-123",
    client: "Jane Doe",
    priority: "P2 - Same Day",
    type: "commercial",
    address: "654 Oak St",
    trade: "Plumbing",
    status: "Open",
    nte: "$321",
    assignee: "Sarah Smith",
  },
  {
    id: 12,
    poNumber: "9876-543-210",
    client: "Tom Smith",
    priority: "P3 - Standard",
    type: "residential",
    address: "987 Main St",
    trade: "Heating",
    status: "Completed",
    nte: "$123",
    assignee: "Jane Doe",
  },
];

export const projectQuoteData: {
  id: number;
  number: number;
  dateCreated: Date;
  amount: number;
  status: "draft" | "approved";
}[] = [
  {
    id: 1,
    number: 1247,
    dateCreated: new Date("2025-02-19T04:07:12.000Z"),
    amount: 250.0,
    status: "draft",
  },
  {
    id: 2,
    number: 8290,
    dateCreated: new Date("2025-02-19T04:07:12.000Z"),
    amount: 500.0,
    status: "approved",
  },
  {
    id: 3,
    number: 3123,
    dateCreated: new Date("2025-02-19T04:07:12.000Z"),
    amount: 300.0,
    status: "draft",
  },
  {
    id: 4,
    number: 4234,
    dateCreated: new Date("2025-02-19T04:07:12.000Z"),
    amount: 400.0,
    status: "approved",
  },
];

export const projectDocumentData: {
  id: number;
  title: string;
  dateCreated: Date;
  type: string;
}[] = [
  {
    id: 1,
    title: "Assessment_1.jpg",
    dateCreated: new Date("2025-02-19T04:07:12.000Z"),
    type: "Assessment Photo",
  },
  {
    id: 2,
    title: "Assessment_2.jpg",
    dateCreated: new Date("2025-02-19T04:07:12.000Z"),
    type: "Assessment Photo",
  },
  {
    id: 3,
    title: "Assessment_3.jpg",
    dateCreated: new Date("2025-02-19T04:07:12.000Z"),
    type: "Assessment Photo",
  },
  {
    id: 4,
    title: "Assessment_4.jpg",
    dateCreated: new Date("2025-02-19T04:07:12.000Z"),
    type: "Assessment Photo",
  },
];

export const clientsData: {
  id: number;
  clientName: string;
  status: "Compliant and Active" | "Compliant and Non-active";
  type: "commercial" | "residential";
  totalRevenue: number;
}[] = [
  {
    id: 1,
    clientName: "ABC Corp",
    status: "Compliant and Active",
    type: "commercial",
    totalRevenue: 100000,
  },
  {
    id: 2,
    clientName: "XYZ Inc",
    status: "Compliant and Non-active",
    type: "residential",
    totalRevenue: 50000,
  },
  {
    id: 3,
    clientName: "PQR Ltd",
    status: "Compliant and Active",
    type: "commercial",
    totalRevenue: 80000,
  },
  {
    id: 4,
    clientName: "LMN Corp",
    status: "Compliant and Non-active",
    type: "residential",
    totalRevenue: 70000,
  },
  {
    id: 5,
    clientName: "STU Inc",
    status: "Compliant and Active",
    type: "commercial",
    totalRevenue: 120000,
  },
  {
    id: 6,
    clientName: "VWX Corp",
    status: "Compliant and Non-active",
    type: "residential",
    totalRevenue: 60000,
  },
  {
    id: 7,
    clientName: "DEF Corp",
    status: "Compliant and Active",
    type: "commercial",
    totalRevenue: 90000,
  },
  {
    id: 8,
    clientName: "GHI Inc",
    status: "Compliant and Non-active",
    type: "residential",
    totalRevenue: 75000,
  },
  {
    id: 9,
    clientName: "JKL Corp",
    status: "Compliant and Active",
    type: "commercial",
    totalRevenue: 110000,
  },
  {
    id: 10,
    clientName: "MNO Corp",
    status: "Compliant and Non-active",
    type: "residential",
    totalRevenue: 65000,
  },
];

export const invoicesData: {
  id: number;
  clientName: string;
  invoiceNumber: number;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: "Outstanding" | "Draft" | "Collected";
}[] = [
  {
    id: 1,
    clientName: "ABC Corp",
    invoiceNumber: 202,
    issueDate: "21/2/2025",
    dueDate: "24/2/2025",
    amount: 2500,
    status: "Draft",
  },
  {
    id: 2,
    clientName: "Lockheed",
    invoiceNumber: 203,
    issueDate: "25/3/2025",
    dueDate: "30/4/2025",
    amount: 3520,
    status: "Collected",
  },
  {
    id: 3,
    clientName: "Lockheed",
    invoiceNumber: 204,
    issueDate: "21/2/2025",
    dueDate: "24/2/2025",
    amount: 1500,
    status: "Draft",
  },
  {
    id: 4,
    clientName: "Lockheed",
    invoiceNumber: 206,
    issueDate: "25/3/2025",
    dueDate: "30/4/2025",
    amount: 3020,
    status: "Collected",
  },
  {
    id: 5,
    clientName: "ABC Corp",
    invoiceNumber: 202,
    issueDate: "21/8/2025",
    dueDate: "24/10/2025",
    amount: 1500,
    status: "Draft",
  },
  {
    id: 6,
    clientName: "Lockheed",
    invoiceNumber: 210,
    issueDate: "25/3/2025",
    dueDate: "30/4/2025",
    amount: 3520,
    status: "Collected",
  },
  {
    id: 7,
    clientName: "ABC Corp",
    invoiceNumber: 200,
    issueDate: "21/2/2025",
    dueDate: "24/2/2025",
    amount: 2000,
    status: "Draft",
  },
  {
    id: 8,
    clientName: "Lockheed",
    invoiceNumber: 201,
    issueDate: "25/3/2025",
    dueDate: "30/4/2025",
    amount: 2520,
    status: "Collected",
  },
];
