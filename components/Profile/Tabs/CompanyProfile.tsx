import React from "react";
import CollapsibleBox from "@/components/Profile/CollapsibleBox";

type Field = { label: string; answer: string };

const CompanyProfileTab: React.FC = () => {
  const basic: Field[] = [
    { label: "Company Name", answer: "MHC" },
    { label: "Address", answer: "1670 Athro, Las Vegas, Nevada, 89105, United States of America" },
    { label: "Satellite Oce Address", answer: "Inapplicable" },
    { label: "Organization Type", answer: "Type 1" },
    { label: "Year of Establishment", answer: "1994" },
    { label: "Annual Revenue (2023)", answer: "$111,003,112.00" },
    { label: "Total Revenue (5 Years)", answer: "$111,003,112.00" },
    { label: "Accepted Payment Methods", answer: "Paypal, Venmo, Bank, Wire Transfer, Throne, YouPay" },
    { label: "NAICS", answer: "Inapplicable" },
    { label: "DUNS", answer: "Inapplicable" }
  ];

  const service: Field[] = [
    { label: "Coverage Area", answer: "2000 sqm" },
    { label: "Number of Admin Staff", answer: "100+" },
    { label: "Number of Field Staff", answer: "230" },
    { label: "License(s)", answer: "Almost everything" },
    { label: "Working Hours", answer: "9:00 AM - 5:00 PM" },
    { label: "Cover Afterhours", answer: "Yes" },
    { label: "Cover Weekend Calls", answer: "Yes" }
  ];

  const contact: Field[] = [
    { label: "Dispatch Supervisor", answer: "Ziad Baroud" },
    { label: "Field Supervisor", answer: "John Doe" },
    { label: "Management Supervisor", answer: "John Doe" },
    { label: "Regular Hours", answer: "John Doe" },
    { label: "Emergency Hours", answer: "John Doe" }
  ];

  const load: Field[] = [
    { label: "Average monthly work tickets", answer: "15" },
    { label: "Percentage Split of PO source", answer: "20% Residential, 30% Commercial, 50% Industrial" },
    { label: "Current Monthly PO capacity", answer: "300" }
  ];

  const client: Field[] = [
    { label: "Company Name", answer: "MHC" },
    { label: "Contact Name", answer: "John Doe" },
    { label: "Email", answer: "markhallak@outlook.com" },
    { label: "Phone Number", answer: "+1 630 210 2213" }
  ];

  const trade: Field[] = [
    { label: "Handyman", answer: "Yes" },
    { label: "Electrical (Interior)", answer: "Yes" },
    { label: "Electrical (Exterior)", answer: "Yes" },
    { label: "Exterior Signs", answer: "Yes" },
    { label: "HVAC & Refrigeration", answer: "Yes" },
    { label: "Plumbing", answer: "Yes" },
    { label: "Drain Cleaning", answer: "Yes" },
    { label: "Fire Remediation", answer: "Yes" },
    { label: "Mold Remediation", answer: "Yes" },
    { label: "Water Remediation", answer: "Yes" },
    { label: "Locksmith, Doors, Locks", answer: "Yes" },
    { label: "Garage Doors", answer: "Yes" },
    { label: "Glass Replacement", answer: "Yes" },
    { label: "Painting", answer: "Yes" },
    { label: "Power Washing / Exterior", answer: "Yes" },
    { label: "Cleaning", answer: "Yes" },
    { label: "Exterior Services", answer: "Yes" },
    { label: "Concrete and Epoxy", answer: "Yes" },
    { label: "Pest Control", answer: "Yes" },
    { label: "Masonry", answer: "Yes" },
    { label: "Welding", answer: "Yes" },
    { label: "Roofing", answer: "Yes" },
    { label: "Parking Lot Striping", answer: "Yes" },
    { label: "Flooring", answer: "Yes" },
    { label: "Carpentry", answer: "Yes" },
    { label: "Store Rollouts", answer: "Yes" },
    { label: "Store Closeouts", answer: "Yes" },
    { label: "Renovations", answer: "Yes" }
  ];

  return (
      <div className="overflow-hidden mb-10 grid grid-cols-1 md:grid-cols-2 gap-y-12 md:gap-x-8 items-stretch pt-14 sm:pt-10 auto-rows-auto h-full content-stretch">
        <CollapsibleBox title="Basic Information" fields={basic} />
        <CollapsibleBox title="Service Information" fields={service} />
        <CollapsibleBox title="Contact Info" fields={contact} />
        <CollapsibleBox title="Load Info" fields={load} />
        <CollapsibleBox title="Client References" fields={client} />
        <CollapsibleBox title="Trade Information" fields={trade} />
      </div>
  );
};

export default CompanyProfileTab;