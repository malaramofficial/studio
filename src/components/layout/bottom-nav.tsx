"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, BrainCircuit, Home, Newspaper, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/syllabus", label: "Syllabus", icon: BookOpen },
  { href: "/tests", label: "Tests", icon: Newspaper },
  { href: "/ai", label: "AI Tutor", icon: BrainCircuit },
  { href: "/creator", label: "Creator", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full border-t bg-background/95 backdrop-blur-sm md:hidden">
      <div className="grid h-16 grid-cols-5 max-w-lg mx-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "inline-flex flex-col items-center justify-center p-2 hover:bg-muted group transition-colors",
               (pathname === item.href || (item.href !== '/home' && pathname.startsWith(item.href)))
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
