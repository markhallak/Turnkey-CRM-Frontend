"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useRouter } from "next/router";
import { encryptPost, decryptPost } from "@/lib/apiClient";
import { useToast } from "@/hooks/use-toast";

interface PricingRow {
  label: string;
  regular: string;
  after: string;
  isCustom: boolean;
}

const ClientReferencesSection = forwardRef(function ClientReferencesSection(_, ref) {
  const [refs, setRefs] = useState(
    Array.from({ length: 3 }, () => ({
      company: "",
      contact: "",
      email: "",
      phone: "",
    }))
  );

  useImperativeHandle(ref, () => ({ get: () => refs }));

  const updateField =
    (index: number, field: "company" | "contact" | "email" | "phone") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = [...refs];
      next[index] = { ...next[index], [field]: e.target.value };
      setRefs(next);
    };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Company Name</TableHead>
              <TableHead>Contact Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone Number</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {refs.map((ref, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  <Input
                    className="focus-visible:ring-blue-600"
                    value={ref.company}
                    onChange={updateField(idx, "company")}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    className="focus-visible:ring-blue-600"
                    value={ref.contact}
                    onChange={updateField(idx, "contact")}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    className="focus-visible:ring-blue-600"
                    value={ref.email}
                    onChange={updateField(idx, "email")}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    className="focus-visible:ring-blue-600"
                    value={ref.phone}
                    onChange={updateField(idx, "phone")}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
});

const PricingStructureSection = forwardRef(function PricingStructureSection(_, ref) {
  const [rows, setRows] = useState<PricingRow[]>([
    { label: "Trip Charge", regular: "", after: "", isCustom: false },
    { label: "Material Markup", regular: "", after: "", isCustom: false },
    { label: "", regular: "", after: "", isCustom: true },
  ]);

  useEffect(() => {
    const fixedCount = 2;
    const fixed = rows.slice(0, fixedCount);
    const custom = rows.slice(fixedCount);

    // keep only those with any value
    const filled = custom.filter(
      (r) =>
        r.label.trim() !== "" ||
        r.regular.trim() !== "" ||
        r.after.trim() !== ""
    );

    // always end with exactly one blank
    const newCustom = [
      ...filled,
      { label: "", regular: "", after: "", isCustom: true },
    ];
    const newRows = [...fixed, ...newCustom];

    // only update if something actually changed
    if (
      newRows.length !== rows.length ||
      newRows.some(
        (r, i) =>
          r.label !== rows[i].label ||
          r.regular !== rows[i].regular ||
          r.after !== rows[i].after
      )
    ) {
      setRows(newRows);
    }
  }, [rows]);

  useImperativeHandle(ref, () => ({ get: () => rows.filter(r => r.label || r.regular || r.after) }));

  return (
    <div className="overflow-x-auto rounded-lg">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead className="text-center">Regular Hours</TableHead>
            <TableHead className="text-center">After Hours</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow key={idx}>
              <TableCell>
                {row.isCustom ? (
                  <Input
                    className="focus-visible:ring-blue-600"
                    value={row.label}
                    onChange={(e) => {
                      const value = e.target.value;
                      setRows((prev) =>
                        prev.map((r, i) =>
                          i === idx ? { ...r, label: value } : r
                        )
                      );
                    }}
                  />
                ) : (
                  row.label
                )}
              </TableCell>
              <TableCell className="text-center">
                <Input
                  className="focus-visible:ring-blue-600"
                  value={row.regular}
                  onChange={(e) => {
                    const value = e.target.value;
                    setRows((prev) =>
                      prev.map((r, i) =>
                        i === idx ? { ...r, regular: value } : r
                      )
                    );
                  }}
                />
              </TableCell>
              <TableCell className="text-center">
                <Input
                  className="focus-visible:ring-blue-600"
                  value={row.after}
                  onChange={(e) => {
                    const value = e.target.value;
                    setRows((prev) =>
                      prev.map((r, i) =>
                        i === idx ? { ...r, after: value } : r
                      )
                    );
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
});

function GeneralInfoSection() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name (as shown in W9)</Label>
        <Input id="companyName" className="focus-visible:ring-blue-600" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="streetAddress">Address</Label>
        <Input id="streetAddress" className="focus-visible:ring-blue-600" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="satelliteOffice">
          Satellite Office Address (if applicable)
        </Label>
        <Input id="satelliteOffice" className="focus-visible:ring-blue-600" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="organizationType">Organization Type</Label>
        <Input id="organizationType" className="focus-visible:ring-blue-600" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="establishmentYear">Year of Establishment</Label>
        <Input id="establishmentYear" className="focus-visible:ring-blue-600" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="annualRevenue">Annual Revenue (2023)</Label>
        <Input id="annualRevenue" className="focus-visible:ring-blue-600" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="paymentMethods">Accepted Payment Methods</Label>
        <Input id="paymentMethods" className="focus-visible:ring-blue-600" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="naicsCode">
          NAICS (North American Industry Classification Systems)
        </Label>
        <Input id="naicsCode" className="focus-visible:ring-blue-600" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="dunsNumber">
          DUNS (Data Universal Numbering System)
        </Label>
        <Input id="dunsNumber" className="focus-visible:ring-blue-600" />
      </div>
    </div>
  );
}

function ServiceInfoSection() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="coverageArea">Coverage Area (Cities)</Label>
        <Input id="coverageArea" className="focus-visible:ring-blue-600" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="adminStaffCount">Number of Admin Staff</Label>
        <Input id="adminStaffCount" className="focus-visible:ring-blue-600" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="fieldStaffCount">Number of Field Staff</Label>
        <Input id="fieldStaffCount" className="focus-visible:ring-blue-600" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="licenses">License(s)</Label>
        <Input id="licenses" className="focus-visible:ring-blue-600" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="workingHours">Working Hours</Label>
        <Input id="workingHours" className="focus-visible:ring-blue-600" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="coversAfterHours">Do you cover afterhours?</Label>
        <Input id="coversAfterHours" className="focus-visible:ring-blue-600" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="coversWeekendCalls">Do you cover weekend calls?</Label>
        <Input
          id="coversWeekendCalls"
          className="focus-visible:ring-blue-600"
        />
      </div>
    </div>
  );
}

function ContactInfoSection() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="dispatchSupervisor">
          Dispatch Supervisor (In Charge of Scheduling/Incoming Calls)
        </Label>
        <Input
          id="dispatchSupervisor"
          className="focus-visible:ring-blue-600"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="fieldSupervisor">
          Field Supervisor (In Charge of technical aspects, onground services
          and service techs)
        </Label>
        <Input id="fieldSupervisor" className="focus-visible:ring-blue-600" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="managementSupervisor">
          Management Supervisor (Handles client onboarding and macro level
          decisions)
        </Label>
        <Input
          id="managementSupervisor"
          className="focus-visible:ring-blue-600"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="regularContact">
          Regular Hours (Email & Phone Number)
        </Label>
        <Input id="regularContact" className="focus-visible:ring-blue-600" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="emergencyContact">
          Emergency Hours (Email & Phone Number)
        </Label>
        <Input id="emergencyContact" className="focus-visible:ring-blue-600" />
      </div>
    </div>
  );
}

function LoadInfoSection() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="averageMonthlyTickets">
          Average Monthly Work Tickets (last 4 months)
        </Label>
        <Input
          id="averageMonthlyTickets"
          className="focus-visible:ring-blue-600"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="poSourceSplit">
          Percentage Split of PO Source (ex: 30% Residential, 50% Commercial,
          20% Industrial)
        </Label>
        <Input id="poSourceSplit" className="focus-visible:ring-blue-600" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="monthlyPOCapacity">
          Current Monthly PO Capacity (Maximum capacity # of POs with current
          staff and capabilities)
        </Label>
        <Input id="monthlyPOCapacity" className="focus-visible:ring-blue-600" />
      </div>
    </div>
  );
}

const trades = [
  "Handyman (General Repair)",
  "Electrical (Interior)",
  "Electrical (Exterior)",
  "Exterior Signs",
  "HVAC & Refrigeration",
  "Plumbing",
  "Drain Cleaning (Snaking, HydroJetting)",
  "Fire Remediation",
  "Mold Remediation",
  "Water Remediation",
  "Locksmith, Doors, Locks",
  "Garage Doors",
  "Glass Replacement",
  "Painting",
  "Power Washing / Exterior Cleaning",
  "Exterior Services (asphalt, landscaping)",
  "Concrete and Epoxy",
  "Pest Control",
  "Masonry",
  "Welding",
  "Roofing",
  "Parking Lot Striping",
  "Flooring",
  "Carpentry",
  "Store Rollouts",
  "Store Closeouts",
  "Renovations",
];

export const TradeInfoSection = forwardRef(function TradeInfoSection(_, ref) {
  const [coverage, setCoverage] = useState<
    Record<string, { not: boolean; light: boolean; full: boolean }>
  >(
    Object.fromEntries(
      trades.map((t) => [t, { not: true, light: false, full: false }])
    )
  );

  function toggle(trade: string, key: keyof Coverage) {
    setCoverage((prev) => ({
      ...prev,
      [trade]: {
        not: false,
        light: false,
        full: false,
        [key]: !prev[trade][key],
      },
    }));
  }

  useImperativeHandle(ref, () => ({
    get: () =>
      Object.entries(coverage).map(([trade, vals]) => ({
        trade,
        coverageLevel: vals.full ? 'FULL' : vals.light ? 'LIGHT' : 'NOT',
      })),
  }));

  return (
    <div className="overflow-x-auto rounded-lg">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/2">Trade</TableHead>
            <TableHead className="w-1/6 text-center">Not Covered</TableHead>
            <TableHead className="w-1/6 text-center">Light Coverage</TableHead>
            <TableHead className="w-1/6 text-center">Full Coverage</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trades.map((trade) => (
            <TableRow key={trade}>
              <TableCell>{trade}</TableCell>
              <TableCell className="text-center">
                <Checkbox
                  className="transition-colors duration-200 ease-in-out data-[state=checked]:bg-blue-600
    data-[state=checked]:border-blue-600
    data-[state=checked]:hover:bg-blue-700"
                  checked={coverage[trade].not}
                  onCheckedChange={() => toggle(trade, "not")}
                />
              </TableCell>
              <TableCell className="text-center">
                <Checkbox
                  className="transition-colors duration-200 ease-in-out data-[state=checked]:bg-blue-600
    data-[state=checked]:border-blue-600
    data-[state=checked]:hover:bg-blue-700"
                  checked={coverage[trade].light}
                  onCheckedChange={() => toggle(trade, "light")}
                />
              </TableCell>
              <TableCell className="text-center">
                <Checkbox
                  className="transition-colors duration-200 ease-in-out data-[state=checked]:bg-blue-600
    data-[state=checked]:border-blue-600
    data-[state=checked]:hover:bg-blue-700"
                  checked={coverage[trade].full}
                  onCheckedChange={() => toggle(trade, "full")}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
});

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const router = useRouter();
  const { toast } = useToast();
  const pricingRef = useRef<any>(null);
  const refsRef = useRef<any>(null);
  const tradeRef = useRef<any>(null);

  const clientId = router.query.client_id as string | undefined;

  const sections = [
    {
      title: "General Information",
      description:
        "First, we need to know a little bit more about your organization.",
      element: <GeneralInfoSection />,
    },
    {
      title: "Service Information",
      description:
        "Now, let us understand the services you provide and how they operate within your organization.",
      element: <ServiceInfoSection />,
    },
    {
      title: "Contact Information",
      description:
        "Please provide your primary contact details so we can reach out with updates and support.",
      element: <ContactInfoSection />,
    },
    {
      title: "Load Information",
      description:
        "Please share your key workload and capacity metrics, so we can tailor our support.",
      element: <LoadInfoSection />,
    },
    {
      title: "Trade Information",
      description:
        "Please indicate your service trade coverage levels, so we can understand your core competencies.",
        element: <TradeInfoSection ref={tradeRef} />,
    },
    {
      title: "Pricing Structure",
      description:
        "Please outline your regular and after-hours pricing for key services so we can align on cost structures.",
        element: <PricingStructureSection ref={pricingRef} />,
    },
    {
      title: "Client References",
      description: "Please provide 3 trusted references in the table below.",
        element: <ClientReferencesSection ref={refsRef} />,
    },
  ];

  const progress = ((step + 1) / sections.length) * 100;

  function validate(idx: number) {
    if (process.env.NEXT_PUBLIC_BYPASS_ONBOARDING_CHECKS === 'true') return true;
    const ids: Record<number, string[]> = {
      0: [
        'companyName',
        'streetAddress',
        'organizationType',
        'establishmentYear',
        'annualRevenue',
        'paymentMethods',
        'naicsCode',
        'dunsNumber',
      ],
      1: [
        'coverageArea',
        'adminStaffCount',
        'fieldStaffCount',
        'licenses',
        'workingHours',
        'coversAfterHours',
        'coversWeekendCalls',
      ],
      2: [
        'dispatchSupervisor',
        'fieldSupervisor',
        'managementSupervisor',
        'regularContact',
        'emergencyContact',
      ],
      3: ['averageMonthlyTickets', 'poSourceSplit', 'monthlyPOCapacity'],
    };
    const list = ids[idx] || [];
    let ok = true;
    for (const id of list) {
      const el = document.getElementById(id) as HTMLInputElement | null;
      if (!el) continue;
      if (!el.value.trim()) {
        el.classList.add('border-red-500');
        ok = false;
      } else {
        el.classList.remove('border-red-500');
      }
    }
    if (!ok) {
      toast({ description: "Make sure all required fields aren't empty", variant: 'destructive' });
    }
    return ok;
  }

  async function save() {
    if (!clientId) {
      router.push('/dashboard');
      return;
    }
    const payload = {
      clientId,
      general: {
        satelliteOfficeAddress: (document.getElementById('satelliteOffice') as HTMLInputElement)?.value,
        organizationType: (document.getElementById('organizationType') as HTMLInputElement)?.value,
        establishmentYear: (document.getElementById('establishmentYear') as HTMLInputElement)?.value,
        annualRevenue: (document.getElementById('annualRevenue') as HTMLInputElement)?.value,
        paymentMethods: (document.getElementById('paymentMethods') as HTMLInputElement)?.value,
        naicsCode: (document.getElementById('naicsCode') as HTMLInputElement)?.value,
        dunsNumber: (document.getElementById('dunsNumber') as HTMLInputElement)?.value,
      },
      service: {
        coverageArea: (document.getElementById('coverageArea') as HTMLInputElement)?.value,
        adminStaffCount: (document.getElementById('adminStaffCount') as HTMLInputElement)?.value,
        fieldStaffCount: (document.getElementById('fieldStaffCount') as HTMLInputElement)?.value,
        licenses: (document.getElementById('licenses') as HTMLInputElement)?.value,
        workingHours: (document.getElementById('workingHours') as HTMLInputElement)?.value,
        coversAfterHours: (document.getElementById('coversAfterHours') as HTMLInputElement)?.value,
        coversWeekendCalls: (document.getElementById('coversWeekendCalls') as HTMLInputElement)?.value,
      },
      contact: {
        dispatchSupervisor: (document.getElementById('dispatchSupervisor') as HTMLInputElement)?.value,
        fieldSupervisor: (document.getElementById('fieldSupervisor') as HTMLInputElement)?.value,
        managementSupervisor: (document.getElementById('managementSupervisor') as HTMLInputElement)?.value,
        regularContact: (document.getElementById('regularContact') as HTMLInputElement)?.value,
        emergencyContact: (document.getElementById('emergencyContact') as HTMLInputElement)?.value,
      },
      load: {
        averageMonthlyTickets: (document.getElementById('averageMonthlyTickets') as HTMLInputElement)?.value,
        poSourceSplit: (document.getElementById('poSourceSplit') as HTMLInputElement)?.value,
        monthlyPOCapacity: (document.getElementById('monthlyPOCapacity') as HTMLInputElement)?.value,
      },
      tradeCoverage: tradeRef.current?.get() || [],
      pricing: pricingRef.current?.get() || [],
      references: refsRef.current?.get() || [],
      bypassChecks: process.env.NEXT_PUBLIC_BYPASS_ONBOARDING_CHECKS === 'true',
    };
    try {
      await decryptPost(await encryptPost('/save-onboarding-data', payload));
    } catch (e) {
      console.error(e);
    }
    router.push('/dashboard');
  }

  return (
    <div className="h-screen flex flex-col !overflow-hidden">
      <header
        className="sticky top-0 w-full z-10 bg-white     flex flex-col justify-between
        !overflow-hidden
    text-center
    pt-4 sm:pt-6
    min-h-[15vh] sm:min-h-[23vh] pb-0 mb-0"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full !overflow-hidden"
          >
            <h1 className="text-3xl sm:text-4xl font-bold">
              {sections[step].title}
            </h1>
            <p className="text-muted-foreground mt-2 px-6">
              {sections[step].description}
            </p>
          </motion.div>
        </AnimatePresence>

        <Progress
          value={progress}
          className="
    h-[0.3rem] w-full mt-2
    rounded-none rounded-tr-full rounded-br-full
    [&>div]:transition-all
    [&>div]:duration-300
    [&>div]:ease-in-out
    [&>div]:bg-gradient-to-r
    [&>div]:from-blue-900
    [&>div]:via-blue-700
    [&>div]:to-blue-600
    [&>div]:rounded-r-full
  "
        />
      </header>

      <main className="flex-1 !overflow-hidden">
        <ScrollArea key={step} className="h-full sm:h-full w-full">
          <div className="max-w-3xl mx-auto px-8 pt-5 sm:px-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {sections[step].element}
              </motion.div>
            </AnimatePresence>
              {step < sections.length - 1 ? (
                <div className="flex justify-end py-8">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 w-20 text-white"
                    onClick={() => {
                      if (!validate(step)) return;
                      setStep((s) => s + 1);
                    }}
                  >
                    Next
                  </Button>
                </div>
              ) : (
                <div className="flex justify-end py-8">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 w-20 text-white"
                    onClick={() => {
                    if (!validate(step)) return;
                    save();
                    }}
                  >
                    Finish
                  </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
