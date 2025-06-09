import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Paperclip, Send, User } from "lucide-react";
import MessageBubble from "@/components/Projects/MessageBubble";
import { ScrollArea } from "@/components/ui/scroll-area";

type Attachment = {
  name: string;
  extension: string;
  size: string;
  url: string;
};

type Message = {
  text: string;
  sender: "employee" | "client";
  timestamp: string;
  date: Date;
  attachments?: Attachment[];
};

const initialMessages: Message[] = [
  {
    text: "Hi there! What can I assist you with today?",
    sender: "employee",
    timestamp: "10:00 AM",
    date: new Date(2025, 4, 15),
  },
  {
    text: "Need any help finding something?",
    sender: "employee",
    timestamp: "10:00 AM",
    date: new Date(2025, 4, 15),
  },
  {
    text: "Good morning! How may I be of service?",
    sender: "employee",
    timestamp: "10:00 AM",
    date: new Date(2025, 4, 15),
  },
  {
    text: "Hey! Got a question for me?",
    sender: "employee",
    timestamp: "10:00 AM",
    date: new Date(2025, 4, 15),
  },
  {
    text: "Welcome! What do you need help with?",
    sender: "employee",
    timestamp: "10:00 AM",
    date: new Date(2025, 4, 15),
  },
  {
    text: "What can I do for you today?",
    sender: "employee",
    timestamp: "10:00 AM",
    date: new Date(2025, 4, 15),
  },
  {
    text: "Hello! Do you need assistance with anything?",
    sender: "employee",
    timestamp: "10:00 AM",
    date: new Date(2025, 4, 15),
  },
  {
    text: "How can I support you today?",
    sender: "employee",
    timestamp: "10:00 AM",
    date: new Date(2025, 4, 15),
  },
  {
    text: "Hello! Looking for something in particular?",
    sender: "employee",
    timestamp: "10:00 AM",
    date: new Date(2025, 4, 15),
  },
  {
    text: "Hi! Feel free to ask me anything.",
    sender: "employee",
    timestamp: "10:00 AM",
    date: new Date(2025, 4, 15),
  },
  {
    text: "Hey there! How can I help out?",
    sender: "employee",
    timestamp: "10:00 AM",
    date: new Date(2025, 4, 15),
  },
  {
    text: "Hello! Need guidance or support?",
    sender: "employee",
    timestamp: "10:00 AM",
    date: new Date(2025, 4, 15),
  },
  {
    text: "Good to see you! What are you looking for?",
    sender: "employee",
    timestamp: "10:00 AM",
    date: new Date(2025, 4, 15),
  },
  {
    text: "Hey! Can I answer a question for you?",
    sender: "employee",
    timestamp: "10:00 AM",
    date: new Date(2025, 4, 15),
  },
  {
    text: "Hello! Want to explore some options?",
    sender: "employee",
    timestamp: "10:00 AM",
    date: new Date(2025, 4, 15),
  },
  {
    text: "Hi again! What would you like to know?",
    sender: "employee",
    timestamp: "10:00 AM",
    date: new Date(2025, 4, 15),
  },
  {
    text: "Welcome back! Ready to get started?",
    sender: "employee",
    timestamp: "10:00 AM",
    date: new Date(2025, 4, 15),
  },
  {
    text: "Hello! Let me know how I can help.",
    sender: "employee",
    timestamp: "10:00 AM",
    date: new Date(2025, 4, 15),
  },
  {
    text: "Hey! Got something on your mind?",
    sender: "employee",
    timestamp: "10:00 AM",
    date: new Date(2025, 4, 15),
  },
  {
    text: "Hi! I'm here if you need anything.",
    sender: "employee",
    timestamp: "10:00 AM",
    date: new Date(2025, 4, 15),
  },
  {
    text: "I need some information about your services.",
    sender: "client",
    timestamp: "10:01 AM",
    date: new Date(2025, 4, 15),
  },
  {
    text: "Here's our PDF with full details.",
    sender: "client",
    timestamp: "10:05 AM",
    date: new Date(2025, 4, 15),
    attachments: [
      {
        name: "Flowbite Terms & Conditions",
        extension: "PDF",
        size: "18 MB",
        url: "#",
      },
    ],
  },
  {
    text: "Sure, I'll take a look.",
    sender: "employee",
    timestamp: "10:06 AM",
    date: new Date(2025, 4, 15),
  },
  {
    text: "Thank you!",
    sender: "client",
    timestamp: "10:07 AM",
    date: new Date(2025, 4, 16),
  },
  {
    text: "Let me know if you have questions.",
    sender: "employee",
    timestamp: "10:08 AM",
    date: new Date(2025, 4, 16),
  },
  {
    text: "Sounds good.",
    sender: "client",
    timestamp: "10:09 AM",
    date: new Date(2025, 4, 16),
  },
  {
    text: "Great!",
    sender: "employee",
    timestamp: "10:10 AM",
    date: new Date(2025, 4, 17),
  },
  {
    text: "We can handle everything from A to Z!",
    sender: "employee",
    timestamp: "10:11 AM",
    date: new Date(2025, 4, 17),
  },
  {
    text: "You don't have to worry about anything at all",
    sender: "employee",
    timestamp: "10:12 AM",
    date: new Date(2025, 4, 17),
  },
  {
    text: "Feel free to ask.",
    sender: "employee",
    timestamp: "10:13 AM",
    date: new Date(2025, 4, 17),
  },
  {
    text: "One more doc for you.",
    sender: "employee",
    timestamp: "10:14 AM",
    date: new Date(2025, 4, 17),
    attachments: [
      { name: "Project Plan", extension: "DOCX", size: "2.4 MB", url: "#" },
    ],
  },
  {
    text: "Thanks!",
    sender: "client",
    timestamp: "10:15 AM",
    date: new Date(2025, 4, 17),
  },
  {
    text: "You're welcome.",
    sender: "employee",
    timestamp: "10:16 AM",
    date: new Date(2025, 4, 17),
  },
  {
    text: "Let's proceed.",
    sender: "client",
    timestamp: "10:17 AM",
    date: new Date(2025, 4, 17),
  },
  {
    text: "On it.",
    sender: "employee",
    timestamp: "10:18 AM",
    date: new Date(2025, 4, 17),
  },
  {
    text: "All set.",
    sender: "client",
    timestamp: "10:21 AM",
    date: new Date(2025, 4, 17),
  },
  {
    text: "I need more info about the refund policy",
    sender: "client",
    timestamp: "10:21 AM",
    date: new Date(2025, 4, 17),
  },
  {
    text: "I heard some bad experiences",
    sender: "client",
    timestamp: "10:21 AM",
    date: new Date(2025, 4, 17),
  },
  {
    text: "Any info?",
    sender: "client",
    timestamp: "10:21 AM",
    date: new Date(2025, 4, 17),
  },
  {
    text: "Let me refer you to the refund team and they'll be able to assist you with that!",
    sender: "employee",
    timestamp: "10:21 AM",
    date: new Date(2025, 4, 17),
  },
  {
    text: "Sounds good!!",
    sender: "client",
    timestamp: "10:21 AM",
    date: new Date(2025, 4, 17),
  },
  {
    text: "Great chat!",
    sender: "employee",
    timestamp: "10:22 AM",
    date: new Date(2025, 4, 17),
  },
  {
    text: "Indeed.",
    sender: "client",
    timestamp: "10:23 AM",
    date: new Date(2025, 4, 17),
  },
  {
    text: "Bye!",
    sender: "employee",
    timestamp: "10:24 AM",
    date: new Date(2025, 4, 17),
  },
];

export default function ChatUI({ clientname }: { clientname: string }) {
  const [allMessages, setAllMessages] = useState<Message[]>(initialMessages);
  const [visibleCount, setVisibleCount] = useState(20);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messageType, setMessageType] = useState<"employee" | "all">(
    "employee"
  );
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredMessages =
    messageType === "employee"
      ? allMessages.filter((m) => m.sender === "employee")
      : allMessages;
  const visibleMessages = filteredMessages.slice(-visibleCount);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const sendFileMessage = (file: File) => {
    const now = new Date();
    const ts = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const name = file.name.replace(/\.[^/.]+$/, "");
    const extension = file.name.split(".").pop() || "";
    const size = formatSize(file.size);
    const url = URL.createObjectURL(file);
    const msg: Message = {
      text: "",
      sender: "employee",
      timestamp: ts,
      date: now,
      attachments: [{ name, extension, size, url }],
    };
    setAllMessages((prev) => [...prev, msg]);
    setVisibleCount((c) => c + 1);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(sendFileMessage);
    e.target.value = "";
  };

  useLayoutEffect(() => {
    const vp = scrollAreaRef.current?.querySelector<HTMLElement>(
      "[data-scroll-area-viewport],[data-radix-scroll-area-viewport]"
    );
    vp?.scrollTo({ top: vp.scrollHeight, behavior: "smooth" });
  }, [filteredMessages.length]);

  useEffect(() => {
    const vp = scrollAreaRef.current?.querySelector<HTMLElement>(
      "[data-scroll-area-viewport],[data-radix-scroll-area-viewport]"
    );
    if (!vp) return;
    let prevScrollHeight = 0;

    const onScroll = () => {
      if (
        vp.scrollTop <= 0 &&
        visibleCount < filteredMessages.length &&
        !isLoading
      ) {
        prevScrollHeight = vp.scrollHeight;
        setIsLoading(true);
        setTimeout(() => {
          setVisibleCount((c) => Math.min(filteredMessages.length, c + 20));
          setIsLoading(false);
          requestAnimationFrame(() => {
            const newHeight = vp.scrollHeight;
            vp.scrollTop = newHeight - prevScrollHeight;
          });
        }, 2000);
      }
    };
    vp.addEventListener("scroll", onScroll);
    return () => vp.removeEventListener("scroll", onScroll);
  }, [visibleCount, filteredMessages.length, isLoading, messageType]);

  const handleSend = () => {
    if (!input.trim()) return;
    const now = new Date();
    const ts = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const userMsg: Message = {
      text: input,
      sender: "employee",
      timestamp: ts,
      date: now,
    };
    setAllMessages((prev) => [...prev, userMsg]);
    setVisibleCount((c) => c + 1);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.rows = 1;
    }
    setTimeout(() => {
      const t = new Date();
      const ts2 = t.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      const reply: Message = {
        text: "That's interesting!",
        sender: "client",
        timestamp: ts2,
        date: t,
      };
      setAllMessages((prev) => [...prev, reply]);
      setVisibleCount((c) => c + 1);
    }, 1000);
  };

  const groups: (Message | { separator: string })[] = [];
  let lastDateKey = "";
  let lastSender: string | null = null;

  for (let i = 0; i < visibleMessages.length; i++) {
    const m = visibleMessages[i];
    const key = m.date.toDateString();
    if (key !== lastDateKey) {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const label =
        key === today.toDateString()
          ? "Today"
          : key === yesterday.toDateString()
          ? "Yesterday"
          : `${m.date.getDate()}/${m.date.getMonth() + 1}/${String(
              m.date.getFullYear()
            ).slice(-2)}`;
      groups.push({ separator: label });
      lastDateKey = key;
      lastSender = null;
    }
    const next = visibleMessages[i + 1];
    const isLastOfMine =
      m.sender === "employee" && (!next || next.sender !== "employee");
    const isFirstOfOthers = m.sender !== "employee" && lastSender !== m.sender;
    const isFirstOfMine = m.sender === "employee" && lastSender !== "employee";
    groups.push({
      ...m,
      __showTime: m.sender === "employee" ? isLastOfMine : isFirstOfOthers,
      __showName: m.sender === "employee" ? isFirstOfMine : isFirstOfOthers,
    } as any);
    lastSender = m.sender;
  }

  return (
    <div className="flex flex-col sm:flex-1 h-[60vh] sm:min-h-0 !lg:min-w-full">
      <input
        type="file"
        multiple
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="px-4 py-2 pb-3">
          {isLoading && (
            <div className="flex justify-center py-2">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
          {groups.map((item, i) =>
            "separator" in item ? (
              <div
                key={i}
                className="w-full text-center my-4 text-xs text-gray-500"
              >
                {item.separator}
              </div>
            ) : (
              <MessageBubble
                key={i}
                text={item.text}
                date={item.date}
                mine={item.sender === "employee"}
                senderName={item.sender === "employee" ? "You" : clientname}
                timestamp={item.timestamp}
                attachments={item.attachments}
                showTime={item.__showTime}
                showName={item.__showName}
              />
            )
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t bg-gray-50">
        <div className="flex items-center px-2 py-1 border border-gray-300 rounded-lg bg-white w-full">
          <textarea
            ref={textareaRef}
            value={input}
            rows={1}
            placeholder="Type a message..."
            className="flex-1 px-0 py-2 resize-none overflow-y-auto max-h-40 border-none outline-none focus:ring-0"
            onChange={(e) => setInput(e.target.value)}
            onInput={(e) => {
              e.currentTarget.style.height = "auto";
              e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <div className="flex items-center space-x-1 ml-2 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip size={20} className="text-gray-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={() =>
                setMessageType((t) => (t === "employee" ? "all" : "employee"))
              }
            >
              <User size={20} className="text-gray-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={handleSend}
            >
              <Send size={20} className="text-blue-500" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
