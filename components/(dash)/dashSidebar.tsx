"use client"

import { Home, Users, Shapes, MessageCircleQuestion, Settings } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

// Menu items
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Diagrams",
    url: "/dashboard/diagrams",
    icon: Shapes,
  },
  {
    title: "Groups",
    url: "/dashboard/groups",
    icon: Users,
  },
  {
    title: "Forums",
    url: "/dashboard/forums",
    icon: MessageCircleQuestion,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
]

export function DashSidebar() {
  const pathname = usePathname()
  
  return (
    <Sidebar className="border-r border-slate-200 dark:border-slate-800">
      <SidebarHeader className="py-6 px-4 flex items-center justify-center">
        <Link href="/dashboard" className="hover:opacity-80 transition-opacity">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 text-transparent bg-clip-text">
            DBMeister
          </h1>
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url || 
                  (item.url !== "/dashboard" && pathname?.startsWith(item.url))
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild 
                      className={`transition-colors ${
                        isActive 
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300" 
                          : "hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Link href={item.url} className="flex items-center gap-3 px-3 py-2 rounded-md">
                        <item.icon className={`w-5 h-5 ${
                          isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-600 dark:text-slate-400"
                        }`}/>
                        <span className={`text-base font-medium ${
                          isActive ? "text-blue-700 dark:text-blue-300" : ""
                        }`}>
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}