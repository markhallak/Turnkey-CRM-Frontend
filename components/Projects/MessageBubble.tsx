// MessageBubble.tsx
import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, CheckCheck, FileText, Download } from "lucide-react";

type Attachment = {
  name: string;
  extension: string;
  size: string;
  url: string;
};

const supported = [
  "pdf",
  "docx",
  "xlsx",
  "jpg",
  "zip",
  "txt",
  "7z",
  "svg",
  "csv",
  "iso",
  "ppt",
  "rar",
  "xls",
];

export default function MessageBubble({
  text,
  mine = false,
  senderName,
  timestamp,
  date,
  attachments,
  showTime = true,
  showName = false,
}: {
  text: string;
  mine?: boolean;
  senderName: string;
  timestamp: string;
  date: Date;
  attachments?: Attachment[];
  showTime?: boolean;
  showName?: boolean;
}) {
  const formattedLabel = React.useMemo(() => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const dateOnly = date.toDateString();
    if (dateOnly === today.toDateString()) return `Today, at ${timestamp}`;
    if (dateOnly === yesterday.toDateString())
      return `Yesterday, at ${timestamp}`;
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}, at ${timestamp}`;
  }, [date, timestamp]);

  const copyText = async () => {
    if (text) await navigator.clipboard.writeText(text);
  };



  return (
    <div
      className={`relative group flex w-full my-2 ${
        mine ? "justify-end" : "justify-start"
      }`}
    >
      <div className="flex flex-col max-w-[75%]">
        {showName &&
          (mine ? (
            <div className="flex justify-end items-center text-xs text-gray-500 mb-1">
              <span className="font-medium text-gray-700 mr-2">
                {senderName}
              </span>
            </div>
          ) : (
            <div className="flex justify-start items-center text-xs text-gray-500 mb-1">
              <span className="font-medium text-gray-700 ml-2 mr-2">
                {senderName}
              </span>
              <span className="text-[0.65rem]">{timestamp}</span>
            </div>
          ))}
        {attachments?.map((a, i) => {
          const ext = a.extension.toLowerCase();
          const iconSrc = supported.includes(ext) ? `/${ext}.svg` : "";
          return (
            <div
              key={i}
              className="flex bg-white border border-gray-200 rounded-lg p-3"
            >

              <div className="flex-shrink-0 flex self-center items-center justify-center w-10 h-10 bg-gray-100 rounded">
                {iconSrc ? (
                  <img src={iconSrc} alt={ext} className="w-8 h-8" />
                ) : (
                  <FileText size={24} className="text-gray-500" />
                )}
              </div>
              <div className="flex-1 ml-3 min-w-0 max-w-xs overflow-hidden">
                <div className="break-all font-medium text-sm">{a.name}</div>
                <div className="text-xs text-gray-500 truncate mt-1">
                  {a.size} • {a.extension}
                </div>
              </div>
              <div className="flex-shrink-0 flex items-center justify-center ml-4">
                <a href={a.url} download>
                  <Download size={20} className="text-gray-500" />
                </a>
              </div>
            </div>
          );
        })}
        {!attachments?.length && (
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`absolute top-1/2 -translate-y-1/2 ${
                    mine ? "right-full mr-2" : "left-full ml-2"
                  } p-1 opacity-0 group-hover:opacity-100 transition-opacity`}
                >
                  <Ellipsis size={16} color="#696969" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align={mine ? "start" : "end"}>
                <DropdownMenuLabel className="font-normal text-xs">
                  {formattedLabel}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="font-normal text-xs"
                  onSelect={copyText}
                >
                  Copy
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <p
              className={`py-2 px-4 rounded-[20px] text-sm leading-relaxed whitespace-pre-wrap max-w-full ${
                mine ? "bg-[#53d769] text-white" : "bg-[#147efb] text-white"
              }`}
              style={{ overflowWrap: "anywhere" }}
            >
              {text}
            </p>
          </div>
        )}
        {mine && showTime && (
          <div className="flex justify-end items-center text-xs text-gray-500 mt-1 mr-1">
            <span className="text-[0.65rem] mr-1">{timestamp}</span>
            <CheckCheck size={14} color="#adadad" />
          </div>
        )}
      </div>
    </div>
  );
}
