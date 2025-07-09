"use client";

import React, { useState } from "react";
import Wrapper from "@/components/Wrapper";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

const newId = (() => {
  let n = 0;
  return () => `el-${++n}`;
})();

function DatePicker({
  date,
  setDate,
}: {
  date: Date | undefined;
  setDate: (d: Date | undefined) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
  variant="outline"
  className="!w-[8rem] !justify-center items-center text-center h-9 flex-shrink-0"
>
  {date ? date.toLocaleDateString() : "Pick a date"}
</Button>

      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Calendar mode="single" selected={date} onSelect={(d) => setDate(d)} />
      </PopoverContent>
    </Popover>
  );
}

export default function Quote() {
  const [layout, setLayout] = useState<"right" | "left">("right");
  const [rows, setRows] = useState<
    { id: string; desc: string; rate: string; qty: string }[]
  >([]);
  const [discount, setDiscount] = useState("0");
  const [amountPaid, setAmountPaid] = useState("0");
  const [issueDate, setIssueDate] = useState<Date>();
  const [dueDate, setDueDate] = useState<Date>();

  const [flag1, setFlag1] = useState<"right" | "left" | null>(null);
  const [flag2, setFlag2] = useState<"right" | "left" | null>(null);
  const [flag3, setFlag3] = useState<"right" | "left" | null>(null);
  const [flag4, setFlag4] = useState<"right" | "left" | null>(null);

  const addRow = () =>
    setRows((r) => [...r, { id: newId(), desc: "", rate: "0", qty: "0" }]);
  const removeRow = (id: string) =>
    setRows((r) => r.filter((row) => row.id !== id));

  const subtotal = rows.reduce(
    (s, r) => s + parseFloat(r.rate || "0") * parseFloat(r.qty || "0"),
    0
  );
  const tax = 0;
  const quoteTotal = subtotal - discount + tax;
  const due = quoteTotal - parseFloat(amountPaid || "0");

  const validateFields = () => {
    const container = document.getElementById("quote-container");
    if (!container) return false;
    let valid = true;
    container.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input, textarea").forEach((el) => {
      const handler = () => {
        if (el.value.trim()) el.classList.remove("border-red-500");
      };
      el.removeEventListener("input", handler);
      el.addEventListener("input", handler);
      if (!el.value.trim()) {
        el.classList.add("border-red-500");
        valid = false;
      }
    });
    return valid;
  };

  const generatePdf = async () => {
    if (!validateFields()) return;
    if (typeof window === "undefined") return;
    const html2pdf = (await import("html2pdf.js")).default;
    const el = document.getElementById("quote-container");
    if (!el) return;
    const clone = el.cloneNode(true) as HTMLElement;
    clone.style.minHeight = "";
    clone.style.height = "auto";
    clone.querySelectorAll(".no-print").forEach((e) => e.remove());
    clone.style.paddingBottom = "0";
    clone.style.border = "none";
    clone.querySelectorAll("input, button").forEach((e) => {
      (e as HTMLElement).style.border = "none";
      (e as HTMLElement).style.background = "transparent";
    });
    clone.querySelectorAll("input").forEach((e) => {
      const elem = e as HTMLElement;
      elem.style.border = "none";
    });
    clone.querySelectorAll("textarea").forEach((ta) => {
      const div = document.createElement("div");
      div.innerText = ta.value;
      const cs = getComputedStyle(ta);
      div.style.cssText = `
    width: ${cs.width};
    min-height: ${ta.scrollHeight}px;
    white-space: pre-wrap;
    overflow-wrap: break-word;
    word-break: break-word;
    font: ${cs.font};
    padding: ${cs.padding};
  `;
      ta.replaceWith(div);
    });
    clone.insertAdjacentHTML(
      "afterbegin",
      `<style>
     @page { margin:0; size: A4 portrait }
     #quote-container { page-break-inside: avoid; }
   </style>`
    );

    document.body.appendChild(clone);

    await html2pdf()
      .set({
        margin: 0,
        filename: "quote.pdf",
        image: { type: "jpeg", quality: 1 },
        jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
        html2canvas: { scale: 2, useCORS: true, dpi: 500 },
        pagebreak: { mode: ["avoid-all"] },
      })
      .from(clone)
      .save();
    document.body.removeChild(clone);
  };

  return (
    <Wrapper title="New Quote">
      <div className="flex justify-between my-5">
        <div
          id="quote-container"
          className="bg-white border border-gray-200 shadow-sm rounded-lg p-8 w-[595pt] flex flex-col gap-10 pb-0"
        >
          <div
            className={`flex justify-between items-start ${
              (flag1 ?? layout) === "right" ? "" : "flex-row-reverse"
            }`}
          >
            <div className="flex flex-col text-sm gap-1">
              <span>MBS Handyman Service LLC</span>
              <span>(959) 999-9586</span>
              <span>160 Deckerman Street</span>
              <span>Hamden, CT 06518</span>
              <span>United States</span>
            </div>
            <img
              src="/turnkey_logo.jpeg"
              className="w-24 h-24 object-contain"
              alt=""
            />
          </div>

          <div
            className={`-mr-2 flex ${
              (flag2 ?? layout) === "right" ? "justify-end" : "justify-start"
            }`}
          >
            <div className="flex flex-col gap-4 w-[20rem]">
              <div
                className={`flex items-center ${
                  (flag2 ?? layout) === "right"
                    ? "justify-end"
                    : "justify-start"
                } gap-2 text-sm`}
              >
                <label
                  className={`font-medium self-center ${
                    (flag2 ?? layout) === "right" ? "" : "mr-7"
                  }`}
                >
                  Prepared For
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className={`h-9 !w-[8rem] ${
                        (flag2 ?? layout) == "right"
                          ? "text-start"
                          : "ml-[0.35rem]"
                      }`}
                    >
                      Choose client
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Client 1</DropdownMenuItem>
                    <DropdownMenuItem>Client 2</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div
                className={`flex items-center ${
                  (flag2 ?? layout) === "right"
                    ? "justify-end"
                    : "justify-start"
                } gap-2 text-sm`}
              >
                <label
                  className={`font-medium self-center ${
                    (flag2 ?? layout) === "right" ? "" : "mr-10"
                  }`}
                >
                  Quote Date
                </label>

                <DatePicker
                  date={issueDate}
                  setDate={setIssueDate}
                />
              </div>
              <div
                className={`flex items-center ${
                  (flag2 ?? layout) === "right"
                    ? "justify-end"
                    : "justify-start"
                } gap-2 text-sm`}
              >
                <label className={`font-medium self-center ${
                    (flag2 ?? layout) === "right" ? "" : "mr-4"
                  }`}>Quote Number</label>
                <Input
                  className="h-9 !w-[8rem] text-center"
                />
              </div>
              <div
                className={`flex ${
                  (flag2 ?? layout) === "right"
                    ? "text-center justify-end"
                    : "justify-start"
                } gap-2 text-sm`}
              >
                <label className={`font-medium self-center ${
                    (flag2 ?? layout) === "right" ? "" : "mr-2"
                  }`}>
                  Client Reference
                </label>
                <Input
                  className="h-9 !w-[8rem] text-center"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-base font-semibold">Pricing</h2>
            <div className="border-t border-gray-300" />
            <div className="grid grid-cols-[3fr_0.75fr_0.5fr_1fr] text-sm font-medium">
              <span className="ml-40">Description</span>
              <span className="ml-5">Rate</span>
              <span className="ml-4">Qty</span>
              <span className="ml-6">Total</span>
            </div>
            {rows.map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-[3fr_0.75fr_0.5fr_1fr] items-start gap-2 text-sm"
              >
                <Textarea
                  className="leading-6 overflow-y-auto max-h-[calc(3.5rem*3)]"
                  rows={1}
                />
                <Input
                  value={row.rate}
                  onChange={(e) =>
                    setRows((r) =>
                      r.map((ro) =>
                        ro.id === row.id ? { ...ro, rate: e.target.value } : ro
                      )
                    )
                  }
                  className="h-9 text-center"
                />
                <Input
                  value={row.qty}
                  onChange={(e) =>
                    setRows((r) =>
                      r.map((ro) =>
                        ro.id === row.id ? { ...ro, qty: e.target.value } : ro
                      )
                    )
                  }
                  className="!h-9 text-center"
                />
                <div className="flex items-center gap-2">
                  <span className="whitespace-normal text-center !w-20 break-all">
                    $
                    {(
                      parseFloat(row.rate || "0") * parseFloat(row.qty || "0")
                    ).toFixed(2)}
                  </span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeRow(row.id)}
                    className="no-print ml-2"
                  >
                    ×
                  </Button>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={addRow}
              className="w-max self-center no-print"
            >
              + Add a Line
            </Button>
          </div>

          <div
            className={`flex flex-col gap-1 text-sm w-1/2 ${
              (flag3 ?? layout) === "right" ? "self-end" : "self-start"
            }`}
          >
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center space-x-2">
              <span className="text-sm">Discount</span>
              <Input
                type="text"
                className="!-mr-3 w-20 h-[2.2rem] text-right"
                value={`$${discount}`}
                onChange={(e) => {
                  // strip leading $ and non-digits before saving
                  let raw = e.target.value
                    .replace(/^\$/, "")
                    .replace(/[^\d.]/g, "");
                  raw = raw.replace(/^0+(?=\d)/, "");

                  if (raw === "") {
                    raw = "0";
                  }
                  setDiscount(raw);
                }}
              />
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-300 my-1" />
            <div className="flex justify-between font-medium">
              <span>Quote Total</span>
              <span>${quoteTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center space-x-2">
              <span>Amount Paid</span>
              <Input
                type="text"
                className="!-mr-3 w-20 h-[2.2rem] text-right"
                value={`$${amountPaid}`}
                onChange={(e) => {
                  let raw = e.target.value
                    .replace(/^\$/, "")
                    .replace(/[^\d.]/g, "");
                  raw = raw.replace(/^0+(?=\d)/, "");

                  if (raw === "") {
                    raw = "0";
                  }
                  setAmountPaid(raw);
                }}
              />
            </div>
            <div className="border-t border-gray-300 my-1" />
            <div className="flex justify-between font-semibold">
              <span>Amount Due (USD)</span>
              <span>${due.toFixed(2)}</span>
            </div>
          </div>

          <div
            className={`flex flex-col gap-2 w-1/2 ${
              (flag4 ?? layout) === "right" ? "self-end" : "self-start"
            } break-inside-avoid pb-4`}
          >
            <label className="font-medium text-sm">Scope of Work</label>
            <Textarea rows={4} className="resize-none" />
          </div>
        </div>

        <div className="flex flex-col gap-4 ml-5 w-40">
          <Select
            value={layout}
            onValueChange={(v) => {
              setLayout(v);
              setFlag1(null);
              setFlag2(null);
              setFlag3(null);
              setFlag4(null);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Layout" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="right">Right Layout</SelectItem>
              <SelectItem value="left">Left Layout</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => {
              setFlag1(Math.random() < 0.5 ? "left" : "right");
              setFlag2(Math.random() < 0.5 ? "left" : "right");
              setFlag3(Math.random() < 0.5 ? "left" : "right");
              setFlag4(Math.random() < 0.5 ? "left" : "right");
              console.log("flag1", flag1);
              console.log("flag2", flag2);
              console.log("flag3", flag3);
              console.log("flag4", flag4);
            }}
          >
            Randomize Layout
          </Button>
          <Button variant="outline" onClick={generatePdf}>
            Download PDF
          </Button>
        </div>
      </div>
    </Wrapper>
  );
}
