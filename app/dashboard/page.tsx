import authorization from "@/lib/authorization";
import NewsFeed from "@/components/ui/newsfeed";
import CreateDiagramDialog from "@/components/(dash)/(dashDiagram)/diagramDialog";
import DashboardDiagrams from "@/components/(dash)/(dashDiagram)/diagramList";
import DashboardGroups from "@/components/(dash)/(dashGroups)/groupList";


export default async function Dashboard() {
  const response = await authorization();

  const newsItems = [
    { id: 1, imgSrc: "/collab1.jpg", alt: "News 1", text: "Collaborate with DBMeister" },
    { id: 2, imgSrc: "/diagrams.jpg", alt: "News 2", text: "Create custom diagrams to your liking" },
    { id: 3, imgSrc: "/tech.jpg", alt: "News 3", text: "DBMeister is killing it" }
  ];

  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const payload = { id: response.userData.id };

  const res = await fetch(`${baseURL}/api/getDashDiagrams`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  let diagramData = await res.json();
  diagramData = diagramData.data;
  console.log("Dashboard diagrams:", diagramData);

  const groupRes = await fetch(`${baseURL}/api/getDashGroups`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  
  let groupData = await groupRes.json();
  groupData = groupData.data.flat();

  
  

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Top Section: News Feed & Greeting */}
      <div className="flex-1 p-6">
        <div className="relative bg-white shadow rounded-lg overflow-hidden mb-6 h-[500px]">
          <NewsFeed newsItems={newsItems} />
        </div>

        <div className="p-4 bg-white shadow rounded-lg mb-6">
          <h2 className="text-xl font-bold">
            Greetings {response.userData.firstName} {response.userData.lastName}
          </h2>
          <p className="mt-2">Explore the links on the left to manage your dashboard.</p>
        </div>

        {/* Diagram Cards Section */}
        <div className="p-4 bg-white shadow rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Your Diagrams</h2>
            <CreateDiagramDialog ownerId={response.userData.id} />
          </div>
          <DashboardDiagrams diagramData={diagramData} />
        </div>
        
        {/* Groups Cards Section */}
        <div className="p-4 bg-white shadow rounded-lg mt-6">
          <h2 className="text-xl font-bold">Your Groups</h2>
          <DashboardGroups groupData={groupData} />
        </div>
      </div>
    </div>
  );
}