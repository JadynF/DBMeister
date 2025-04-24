import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashSidebar } from "@/components/(dash)/dashSidebar"
import authorization from "@/lib/authorization";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const response = await authorization();
  console.log("Sidebar response");
  console.log(response);
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-screen">
        <DashSidebar userData={response.userData}/>
        <SidebarTrigger/>
        <main className="flex-1 w-full p-12">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
