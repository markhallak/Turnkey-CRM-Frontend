import {
  ClipboardList,
  LayoutDashboard,
  User,
  ChevronUp,
  LogOut,
  BriefcaseBusiness,
  Wallet,
  CircleHelp,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Projects",
    url: "/projects",
    icon: ClipboardList,
  },
  {
    title: "Clients",
    url: "/clients",
    icon: BriefcaseBusiness,
  },
  {
    title: "Billing",
    url: "/billing",
    icon: Wallet,
  },
];

export default function AppSidebar() {
  const [email, setEmail] = useState("");
  useEffect(() => {
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith("session="));
    if (!match) return;
    try {
      const token = match.split("=")[1];
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.sub) setEmail(payload.sub);
    } catch {}
  }, []);
  return (
    <Sidebar>
      <SidebarHeader className="flex flex-row items-center px-4 py-[1.21rem] space-x-2">
        <Image
          src="https://images.squarespace-cdn.com/content/v1/65dccd9507a4f103fe5b6f9d/ebb6c888-e03f-4f33-b659-d7bb41697d70/favicon.ico?format=100w"
          alt="Site Favicon"
          width={25}
          height={25}
        />
        <span className="font-semibold text-base">TurnKey Consultancy</span>
      </SidebarHeader>

      <SidebarSeparator className="mx-0" />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="focus:!ring-0">
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className="flex items-center space-x-1 !text-base"
                    >
                      <item.icon className="!w-5 !h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  {email || "Current User"}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <Link href="/profile">
                  <DropdownMenuItem>
                    <User />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/login">
                  <DropdownMenuItem>
                    <LogOut />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem>
                  <CircleHelp />
                  <span>Help</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
