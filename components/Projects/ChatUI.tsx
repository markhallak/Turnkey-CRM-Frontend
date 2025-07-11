import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Paperclip, Send, User } from "lucide-react";
import MessageBubble from "@/components/Projects/MessageBubble";
import { ScrollArea } from "@/components/ui/scroll-area";
import { encryptPost, decryptPost } from "@/lib/apiClient";
import { useAuth } from "@/lib/authContext";

type Attachment = {
  name: string;
  extension: string;
  size: string;
  url: string;
};

type Message = {
  id: string;
  text: string;
  senderEmail: string;
  senderRole: string;
  timestamp: string;
  date: Date;
  mentions: string[];
  attachments?: Attachment[];
};


export default function ChatUI({ projectId, clientname, clientId }: { projectId: string; clientname: string; clientId?: string }) {
    const { email, isClient, role } = useAuth();
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [visibleCount, setVisibleCount] = useState(20);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cursor, setCursor] = useState<{ ts?: string; id?: string }>({});
  const [messageType, setMessageType] = useState<"internal" | "all">(
    isClient ? "all" : "internal"
  );
  const [mentionOptions, setMentionOptions] = useState<any[]>([]);
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [selectedMentions, setSelectedMentions] = useState<any[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadMentions = async () => {
    if (!showMentionDropdown) setShowMentionDropdown(true);
    if (mentionOptions.length) return;
    try {
      const r = await encryptPost("/get-mention-users", { projectId, clientId });
      const j = await decryptPost<any>(r);
      if (j) setMentionOptions(j.users);
    } catch (e) {
      console.error(e);
    }
  };

  const handleMentionSelect = (u: any) => {
    setInput((prev) => `${prev}@${u.firstName} ${u.lastName} `);
    setSelectedMentions((m) => [...m, u]);
    setShowMentionDropdown(false);
    textareaRef.current?.focus();
  };

  useEffect(() => {
    const load = async () => {
      try {
        const r = await encryptPost("/get-messages", { projectId, size: 20 });
        const j = await decryptPost<any>(r);
        if (j) {
          setAllMessages(
            j.messages.map((m: any) => ({
              id: m.id,
              text: m.content,
              senderEmail: m.sender_email,
              senderRole: m.sender_role,
              timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }),
              date: new Date(m.created_at),
              mentions: m.mentions || [],
            }))
          );
          setCursor({ ts: j.last_seen_created_at || undefined, id: j.last_seen_id || undefined });
          setVisibleCount(20);
        }
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [projectId]);

  const filteredMessages =
    messageType === "employee"
      ? allMessages.filter((m) => m.senderRole.startsWith("employee"))
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
      id: "",
      text: "",
      senderEmail: email,
      senderRole: role,
      timestamp: ts,
      date: now,
      mentions: [],
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

  const handleSend = async () => {
    if (!input.trim()) return;
    const now = new Date();
    const ts = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
    const userMsg: Message = { id: "", text: input, senderEmail: email, senderRole: role, timestamp: ts, date: now, mentions: selectedMentions.map((m) => m.email) };
    setAllMessages((prev) => [...prev, userMsg]);
    setVisibleCount((c) => c + 1);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.rows = 1;
    }
    try {
      await decryptPost(
        await encryptPost("/send-message", {
          projectId,
          content: input,
          mentions: selectedMentions.map((m) => m.email),
        })
      );
      setSelectedMentions([]);
      setShowMentionDropdown(false);
    } catch (err) {
      console.error(err);
    }
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
    const isEmployee = m.senderRole.startsWith("employee");
    const nextIsEmployee = next ? next.senderRole.startsWith("employee") : false;
    const isLastOfMine = isEmployee && (!next || !nextIsEmployee);
    const isFirstOfOthers = !isEmployee && lastSender !== m.senderRole;
    const isFirstOfMine = isEmployee && lastSender !== m.senderRole;
    groups.push({
      ...m,
      __showTime: isEmployee ? isLastOfMine : isFirstOfOthers,
      __showName: isEmployee ? isFirstOfMine : isFirstOfOthers,
    } as any);
    lastSender = m.senderRole;
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
                mine={item.senderEmail === email}
                senderName={item.senderEmail === email ? "You" : clientname}
                timestamp={item.timestamp}
                attachments={item.attachments}
                showTime={item.__showTime}
                showName={item.__showName}
                color={item.senderRole.startsWith("employee") ? "green" : "blue"}
              />
            )
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t bg-gray-50">
        <div className="relative flex items-center px-2 py-1 border border-gray-300 rounded-lg bg-white w-full">
          {showMentionDropdown && mentionOptions.length > 0 && (
            <div className="absolute bottom-full left-0 mb-1 bg-white border rounded shadow max-h-40 overflow-auto z-50">
              {mentionOptions.map((u) => (
                <div
                  key={u.email}
                  className="px-2 py-1 hover:bg-gray-100 cursor-pointer whitespace-nowrap"
                  onClick={() => handleMentionSelect(u)}
                >
                  {u.firstName} {u.lastName}
                </div>
              ))}
            </div>
          )}
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
              if (e.key === "@") { loadMentions(); }
              if (e.key === "Escape") setShowMentionDropdown(false);
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
            {!isClient && (
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={() =>
                setMessageType((t) => {
                    // TODO: If this is toggled on, then the messageType should be "internal", otherwise "all"
                    })
              }
            >
              <Building2  size={20} className="text-gray-500" />
            </Button>
            )}
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
