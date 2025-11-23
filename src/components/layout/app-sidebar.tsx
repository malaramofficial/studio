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
  { href: "/home", label: "Home", icon: Home },
  { href: "/syllabus", label: "Syllabus", icon: BookOpen },
  { href: "/tests-v2", label: "Tests", icon: Newspaper },
  { href: "/ai", label: "AI Tutor", icon: BrainCircuit },
  { href: "/creator", label: "Creator", icon: User },
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
