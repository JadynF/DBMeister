import { SidebarProvider } from "@/components/ui/sidebar"
import { DashSidebar } from "@/components/(dash)/dashSidebar"
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashSidebar />
      <main>
        {children}
      </main>
    </SidebarProvider>
  )
}