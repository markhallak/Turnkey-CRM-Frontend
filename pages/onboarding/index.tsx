"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/authContext";
import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
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

interface Reference {
  company: string;
  contact: string;
  email: string;
  phone: string;
}

interface OnboardingData {
  general: Record<string, string>;
  service: Record<string, string>;
  contact: Record<string, string>;
  load: Record<string, string>;
  tradeCoverage: any[];
  pricing: PricingRow[];
  references: Reference[];
  currentStep?: number;
}

const ClientReferencesSection = forwardRef(function ClientReferencesSection(
  { data, onChange }: { data: Reference[]; onChange: (v: Reference[]) => void },
  ref
) {
  const [refs, setRefs] = useState<Reference[]>(() => {
  if (data.length) return data;
    return Array.from({ length: 3 }, () => ({
      company: "",
      contact: "",
      email: "",
      phone: "",
    }))
});

const hasMounted = useRef(false);


  useEffect(() => {
      if (!hasMounted.current) {
    hasMounted.current = true;
    return;
  }
    onChange(refs);
  }, [refs]);

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
                    id={`ref-company-${idx}`}
                    className="focus-visible:ring-blue-600"
                    value={ref.company}
                    onChange={updateField(idx, "company")}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    id={`ref-contact-${idx}`}
                    className="focus-visible:ring-blue-600"
                    value={ref.contact}
                    onChange={updateField(idx, "contact")}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    id={`ref-email-${idx}`}
                    className="focus-visible:ring-blue-600"
                    value={ref.email}
                    onChange={updateField(idx, "email")}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    id={`ref-phone-${idx}`}
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

const PricingStructureSection = forwardRef(function PricingStructureSection(
  { data, onChange }: { data: PricingRow[]; onChange: (v: PricingRow[]) => void },
  ref
) {
  const [rows, setRows] = useState<PricingRow[]>(() => {
  if (data.length) return data;
  return [
    { label: "Trip Charge", regular: "", after: "", isCustom: false },
    { label: "Material Markup", regular: "", after: "", isCustom: false },
    { label: "", regular: "", after: "", isCustom: true },
  ];
});


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

  const hasMounted = useRef(false);

  // 3. replace your existing onChange effect
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    onChange(rows.filter((r) => r.label || r.regular || r.after));
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
                    id={`pricing-label-${idx}`}
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
                  id={`pricing-regular-${idx}`}
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
                  id={`pricing-after-${idx}`}
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

function GeneralInfoSection({ data, onChange }: { data: Record<string, string>; onChange: (k: string, v: string) => void }) {
  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => onChange(k, e.target.value);
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name (as shown in W9)</Label>
        <Input id="companyName" value={data.companyName || ''} onChange={update('companyName')} className="focus-visible:ring-blue-600" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="streetAddress">Address</Label>
        <Input id="streetAddress" value={data.streetAddress || ''} onChange={update('streetAddress')} className="focus-visible:ring-blue-600" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="satelliteOffice">
          Satellite Office Address (if applicable)
        </Label>
        <Input id="satelliteOffice" value={data.satelliteOffice || ''} onChange={update('satelliteOffice')} className="focus-visible:ring-blue-600" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="organizationType">Organization Type</Label>
        <Input id="organizationType" value={data.organizationType || ''} onChange={update('organizationType')} className="focus-visible:ring-blue-600" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="establishmentYear">Year of Establishment</Label>
        <Input id="establishmentYear" value={data.establishmentYear || ''} onChange={update('establishmentYear')} className="focus-visible:ring-blue-600" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="annualRevenue">Annual Revenue (2023)</Label>
        <Input id="annualRevenue" value={data.annualRevenue || ''} onChange={update('annualRevenue')} className="focus-visible:ring-blue-600" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="paymentMethods">Accepted Payment Methods</Label>
        <Input id="paymentMethods" value={data.paymentMethods || ''} onChange={update('paymentMethods')} className="focus-visible:ring-blue-600" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="naicsCode">
          NAICS (North American Industry Classification Systems)
        </Label>
        <Input id="naicsCode" value={data.naicsCode || ''} onChange={update('naicsCode')} className="focus-visible:ring-blue-600" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="dunsNumber">
          DUNS (Data Universal Numbering System)
        </Label>
        <Input id="dunsNumber" value={data.dunsNumber || ''} onChange={update('dunsNumber')} className="focus-visible:ring-blue-600" />
      </div>
    </div>
  );
}

function ServiceInfoSection({ data, onChange }: { data: Record<string, string>; onChange: (k: string, v: string) => void }) {
  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => onChange(k, e.target.value);
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="coverageArea">Coverage Area (Cities)</Label>
        <Input id="coverageArea" value={data.coverageArea || ''} onChange={update('coverageArea')} className="focus-visible:ring-blue-600" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="adminStaffCount">Number of Admin Staff</Label>
        <Input id="adminStaffCount" value={data.adminStaffCount || ''} onChange={update('adminStaffCount')} className="focus-visible:ring-blue-600" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="fieldStaffCount">Number of Field Staff</Label>
        <Input id="fieldStaffCount" value={data.fieldStaffCount || ''} onChange={update('fieldStaffCount')} className="focus-visible:ring-blue-600" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="licenses">License(s)</Label>
        <Input id="licenses" value={data.licenses || ''} onChange={update('licenses')} className="focus-visible:ring-blue-600" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="workingHours">Working Hours</Label>
        <Input id="workingHours" value={data.workingHours || ''} onChange={update('workingHours')} className="focus-visible:ring-blue-600" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="coversAfterHours">Do you cover afterhours?</Label>
        <Input id="coversAfterHours" value={data.coversAfterHours || ''} onChange={update('coversAfterHours')} className="focus-visible:ring-blue-600" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="coversWeekendCalls">Do you cover weekend calls?</Label>
        <Input
          id="coversWeekendCalls"
          value={data.coversWeekendCalls || ''}
          onChange={update('coversWeekendCalls')}
          className="focus-visible:ring-blue-600"
        />
      </div>
    </div>
  );
}

function ContactInfoSection({ data, onChange }: { data: Record<string, string>; onChange: (k: string, v: string) => void }) {
  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => onChange(k, e.target.value);
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="dispatchSupervisor">
          Dispatch Supervisor (In Charge of Scheduling/Incoming Calls)
        </Label>
        <Input
          id="dispatchSupervisor"
          value={data.dispatchSupervisor || ''}
          onChange={update('dispatchSupervisor')}
          className="focus-visible:ring-blue-600"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="fieldSupervisor">
          Field Supervisor (In Charge of technical aspects, onground services
          and service techs)
        </Label>
        <Input id="fieldSupervisor" value={data.fieldSupervisor || ''} onChange={update('fieldSupervisor')} className="focus-visible:ring-blue-600" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="managementSupervisor">
          Management Supervisor (Handles client onboarding and macro level
          decisions)
        </Label>
        <Input
          id="managementSupervisor"
          value={data.managementSupervisor || ''}
          onChange={update('managementSupervisor')}
          className="focus-visible:ring-blue-600"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="regularContact">
          Regular Hours (Email & Phone Number)
        </Label>
        <Input id="regularContact" value={data.regularContact || ''} onChange={update('regularContact')} className="focus-visible:ring-blue-600" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="emergencyContact">
          Emergency Hours (Email & Phone Number)
        </Label>
        <Input id="emergencyContact" value={data.emergencyContact || ''} onChange={update('emergencyContact')} className="focus-visible:ring-blue-600" />
      </div>
    </div>
  );
}

function LoadInfoSection({ data, onChange }: { data: Record<string, string>; onChange: (k: string, v: string) => void }) {
  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => onChange(k, e.target.value);
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="averageMonthlyTickets">
          Average Monthly Work Tickets (last 4 months)
        </Label>
        <Input
          id="averageMonthlyTickets"
          value={data.averageMonthlyTickets || ''}
          onChange={update('averageMonthlyTickets')}
          className="focus-visible:ring-blue-600"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="poSourceSplit">
          Percentage Split of PO Source (ex: 30% Residential, 50% Commercial,
          20% Industrial)
        </Label>
        <Input id="poSourceSplit" value={data.poSourceSplit || ''} onChange={update('poSourceSplit')} className="focus-visible:ring-blue-600" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="monthlyPOCapacity">
          Current Monthly PO Capacity (Maximum capacity # of POs with current
          staff and capabilities)
        </Label>
        <Input id="monthlyPOCapacity" value={data.monthlyPOCapacity || ''} onChange={update('monthlyPOCapacity')} className="focus-visible:ring-blue-600" />
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

export const TradeInfoSection = forwardRef(function TradeInfoSection(
  { data, onChange }: { data: any[]; onChange: (v: any[]) => void },
  ref
) {
  const [coverage, setCoverage] = useState<Record<string, {not:boolean;light:boolean;full:boolean}>>(() => {
  if (data.length) {
    return Object.fromEntries(
      trades.map((t) => {
        const found = data.find((d) => d.trade === t);
        const level = found?.coverageLevel || 'NOT';
        return [
          t,
          {
            not: level === 'NOT',
            light: level === 'LIGHT',
            full: level === 'FULL',
          },
        ];
      })
    );
  }
  return Object.fromEntries(
    trades.map((t) => [t, { not: true, light: false, full: false }])
  );
});


    const hasMounted = useRef(false);

  useEffect(() => {
      if (!hasMounted.current) {
    hasMounted.current = true;
    return;
  }

    onChange(
      Object.entries(coverage).map(([trade, vals]) => ({
        trade,
        coverageLevel: vals.full ? 'FULL' : vals.light ? 'LIGHT' : 'NOT',
      }))
    );
  }, [coverage]);

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
  const defaultData: OnboardingData = {
    general: {},
    service: {},
    contact: {},
    load: {},
    tradeCoverage: [],
    pricing: [],
    references: [],
    currentStep: 0,
  };
  const [formData, setFormData] = useState<OnboardingData>(defaultData);
  const [step, setStep] = useState(0);
  const router = useRouter();
  const { toast } = useToast();
  const pricingRef = useRef<any>(null);
  const refsRef = useRef<any>(null);
  const tradeRef = useRef<any>(null);

  useEffect(() => {
    const match = document.cookie
      .split('; ')
      .find((row) => row.startsWith('onboarding_data='));
    if (match) {
      try {
        const saved = JSON.parse(decodeURIComponent(match.split('=')[1]));
        setFormData({ ...defaultData, ...saved });
        setStep(saved.currentStep || 0);
      } catch {
        setFormData(defaultData);
      }
    }
  }, []);


  const handleGeneralChange = useCallback((k: string, v: string) => {
    setFormData((p) => ({ ...p, general: { ...p.general, [k]: v } }));
  }, []);

  const handleServiceChange = useCallback((k: string, v: string) => {
    setFormData((p) => ({ ...p, service: { ...p.service, [k]: v } }));
  }, []);

  const handleContactChange = useCallback((k: string, v: string) => {
    setFormData((p) => ({ ...p, contact: { ...p.contact, [k]: v } }));
  }, []);

  const handleLoadChange = useCallback((k: string, v: string) => {
    setFormData((p) => ({ ...p, load: { ...p.load, [k]: v } }));
  }, []);

  const handleTradeChange = useCallback((v: any[]) => {
    setFormData((p) => ({ ...p, tradeCoverage: v }));
  }, []);

  const handlePricingChange = useCallback((v: PricingRow[]) => {
    setFormData((p) => ({ ...p, pricing: v }));
  }, []);

  const handleReferencesChange = useCallback((v: Reference[]) => {
    setFormData((p) => ({ ...p, references: v }));
  }, []);

  const sections = [
    {
      title: "General Information",
      description:
        "First, we need to know a little bit more about your organization.",
      element: (
        <GeneralInfoSection data={formData.general} onChange={handleGeneralChange} />
      ),
    },
    {
      title: "Service Information",
      description:
        "Now, let us understand the services you provide and how they operate within your organization.",
      element: (
        <ServiceInfoSection data={formData.service} onChange={handleServiceChange} />
      ),
    },
    {
      title: "Contact Information",
      description:
        "Please provide your primary contact details so we can reach out with updates and support.",
      element: (
        <ContactInfoSection data={formData.contact} onChange={handleContactChange} />
      ),
    },
    {
      title: "Load Information",
      description:
        "Please share your key workload and capacity metrics, so we can tailor our support.",
      element: (
        <LoadInfoSection data={formData.load} onChange={handleLoadChange} />
      ),
    },
    {
      title: "Trade Information",
      description:
        "Please indicate your service trade coverage levels, so we can understand your core competencies.",
        element: (
          <TradeInfoSection ref={tradeRef} data={formData.tradeCoverage} onChange={handleTradeChange} />
        ),
    },
    {
      title: "Pricing Structure",
      description:
        "Please outline your regular and after-hours pricing for key services so we can align on cost structures.",
        element: (
          <PricingStructureSection ref={pricingRef} data={formData.pricing} onChange={handlePricingChange} />
        ),
    },
    {
      title: "Client References",
      description: "Please provide 3 trusted references in the table below.",
        element: (
          <ClientReferencesSection ref={refsRef} data={formData.references} onChange={handleReferencesChange} />
        ),
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
    if (idx === 5) {
      const rows = pricingRef.current?.get() || [];
      rows.forEach((r: PricingRow, i: number) => {
        ['label', 'regular', 'after'].forEach((f) => {
          const el = document.getElementById(`pricing-${f}-${i}`) as HTMLInputElement | null;
          if (!el) return;
          if (!r[f as keyof PricingRow]?.trim()) {
            el.classList.add('border-red-500');
            ok = false;
          } else {
            el.classList.remove('border-red-500');
          }
        });
      });
    }
    if (idx === 6) {
      const refs = refsRef.current?.get() || [];
      refs.forEach((r: Reference, i: number) => {
        ['company', 'contact', 'email', 'phone'].forEach((f) => {
          const el = document.getElementById(`ref-${f}-${i}`) as HTMLInputElement | null;
          if (!el) return;
          if (!(r as any)[f]?.trim()) {
            el.classList.add('border-red-500');
            ok = false;
          } else {
            el.classList.remove('border-red-500');
          }
        });
      });
    }
    if (!ok) {
      toast({ description: "Make sure all required fields aren't empty", variant: 'destructive' });
    }
    return ok;
  }

  const saveCookie = () => {
  const data = { ...formData, currentStep: step };
  document.cookie = `onboarding_data=${encodeURIComponent(JSON.stringify(data))}; path=/; max-age=${60 * 60 * 24}`;
};


  async function save() {

        const { email, isAuthenticated, isClient } = useAuth();

    const payload = {
      email: email || '',
      general: formData.general,
      service: formData.service,
      contact: formData.contact,
      load: formData.load,
      tradeCoverage: formData.tradeCoverage,
      pricing: formData.pricing,
      references: formData.references
    };
    try {
      await decryptPost(await encryptPost('/save-onboarding-data', payload));
      document.cookie = 'onboarding_data=; path=/; max-age=0';
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
            <div className="flex justify-between py-8">
              {step > 0 && (
                <Button
                  className="w-20"
                  variant="outline"
                  onClick={() => {
                    setStep((s) => s - 1);
                    saveCookie();
                  }}
                >
                  Back
                </Button>
              )}
          <div></div>
              {step < sections.length - 1 ? (
                <Button
                  className="bg-blue-600 hover:bg-blue-700 w-20 text-white"
                  onClick={() => {
                    if (!validate(step)) return;
                    setStep((s) => s + 1);
                    saveCookie();
                  }}
                >
                  Next
                </Button>
              ) : (
                <Button
                  className="bg-blue-600 hover:bg-blue-700 w-20 text-white"
                  onClick={() => {
                    if (!validate(step)) return;
                    save();
                  }}
                >
                  Finish
                </Button>
              )}
            </div>
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
