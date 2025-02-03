import { SidebarProvider } from "@/components/ui/sidebar"
import { DashSidebar } from "@/components/(dash)/dashSidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-screen">
        <DashSidebar />
        <main className="flex-1 w-full p-12">{children}</main>
      </div>
    </SidebarProvider>
  );
}
