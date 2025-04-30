// app/dashboard/page.tsx
import authorization from "@/lib/authorization";
import NewsFeed from "@/components/ui/newsfeed";
import CreateDiagramDialog from "@/components/(dash)/(dashDiagram)/diagramDialog";
import DashboardDiagrams from "@/components/(dash)/(dashDiagram)/diagramList";
import DashboardGroups from "@/components/(dash)/(dashGroups)/groupList";

export default async function Dashboard() {
  const response = await authorization();

  const newsItems = [
    { 
      id: 1, 
      imgSrc: "/collab1.jpg", 
      alt: "Team Collaboration", 
      text: "Collaborate with DBMeister",
      description: "Work together with your team in real-time. Share diagrams, collaborate on designs, and keep everyone on the same page with our intuitive collaboration tools."
    },
    { 
      id: 2, 
      imgSrc: "/diagrams.jpg", 
      alt: "Custom Diagrams", 
      text: "Create Custom Diagrams", 
      description: "Design database schemas, ERDs, and system architectures with our powerful diagramming tools. Customize every aspect to match your specific needs."
    },
    { 
      id: 3, 
      imgSrc: "/tech.jpg", 
      alt: "DBMeister Technology", 
      text: "Advanced Technology", 
      description: "Built with cutting-edge technology, DBMeister offers unparalleled performance and reliability for all your database design and management needs."
    }
  ];

  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const payload = { id: response.userData.id };

  const res = await fetch(`${baseURL}/api/getDashDiagrams`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  let diagramData = (await res.json()).data;
  console.log("Dashboard diagrams:", diagramData);

  const groupRes = await fetch(`${baseURL}/api/getDashGroups`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  let groupData = (await groupRes.json()).data.flat();

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Top Section: Hero Carousel */}
      <div className="flex-1 p-6">
        {/* Enhanced Carousel */}
        <div className="relative bg-white dark:bg-slate-800 shadow-lg rounded-xl overflow-hidden mb-8 h-[500px]">
          <NewsFeed newsItems={newsItems} />
        </div>

        {/* Welcome Card with Shadow and Better Spacing */}
        <div className="p-6 bg-white dark:bg-slate-800 shadow-lg rounded-xl mb-8 border-l-4 border-blue-500">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Welcome back, {response.userData.firstName} {response.userData.lastName}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-slate-300">
            Explore your diagrams and groups below or create new ones to get started.
          </p>
        </div>

        {/* Diagram Cards Section - Improved Layout */}
        <div className="p-6 bg-white dark:bg-slate-800 shadow-lg rounded-xl mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Your Diagrams</h2>
            <CreateDiagramDialog ownerId={response.userData.id} />
          </div>
          <DashboardDiagrams diagramData={diagramData} />
        </div>
        
        {/* Groups Cards Section - Improved Layout */}
        <div className="p-6 bg-white dark:bg-slate-800 shadow-lg rounded-xl">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Your Groups</h2>
          <DashboardGroups groupData={groupData} />
        </div>
      </div>
    </div>
  );
}