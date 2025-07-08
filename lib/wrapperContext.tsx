import React, { createContext, useContext } from "react";
import { toast } from "@/hooks/use-toast";
export interface NotificationItem {
  id: string;
  message: string;
  time: string;
  unread: boolean;
  avatar: JSX.Element;
}

export interface WrapperData {
  notifications: NotificationItem[];
  userName: string;
  avatarColor: string;
  setChildLoading: (loading: boolean) => void;
  childLoading: boolean;
}

const WrapperContext = createContext<WrapperData | null>(null);

export function useWrapperData() {
  const ctx = useContext(WrapperContext);
  if (!ctx) {
    toast({ description: "useWrapperData must be used within Wrapper", variant: "destructive" });
    return {} as any;
  }
  return ctx;
}

export default WrapperContext;
