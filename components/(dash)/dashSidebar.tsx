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

// Menu items.
const items = [
  {
    title: "Dashboard Home",
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
  return (
    <Sidebar>
      <SidebarHeader className="text-3xl font-bold text-center bg-blue-100 h-100">DBMeister</SidebarHeader>
      <SidebarContent className="bg-blue-100">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className="w-6 h-6"/>
                      <span className="text-xl">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
