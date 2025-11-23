"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, BrainCircuit, Home, Newspaper, User, GraduationCap } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";

const navItems = [
  { href: "/home", icon: Home, label: "Home" },
  { href: "/syllabus", icon: BookOpen, label: "Syllabus" },
  { href: "/tests", icon: Newspaper, label: "Tests" },
  { href: "/ai", icon: BrainCircuit, label: "AI Tutor" },
  { href: "/creator", icon: User, label: "Creator" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link href="/home" className="flex items-center gap-2 font-headline text-lg font-semibold text-primary">
            <GraduationCap className="h-6 w-6" />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                className="justify-start"
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        {/* Can add user profile or settings here */}
      </SidebarFooter>
    </Sidebar>
  );
}
