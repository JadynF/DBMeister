// app/dashboard/page.tsx

import authorization from "@/lib/authorization";
import NewsFeed from "@/components/ui/newsfeed";
import CreateDiagramDialog from "@/components/(dash)/(dashDiagram)/diagramDialog";
import DashboardDiagrams from "@/components/(dash)/(dashDiagram)/diagramList";

export default async function Dashboard() {
  const response = await authorization();

  const newsItems = [
    { id: 1, imgSrc: "/collab1.jpg", alt: "News 1", text: "Collaborate with DBMeister" },
    { id: 2, imgSrc: "/diagrams.jpg", alt: "News 2", text: "Create custom diagrams to your liking" },
    { id: 3, imgSrc: "/tech.jpg", alt: "News 3", text: "DBMeister is killing it" },
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

  return (
<<<<<<< HEAD
<<<<<<< HEAD
    <div className="flex h-screen">
<<<<<<< HEAD
=======
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <ul className="space-y-4">
          <li>
            <Link href="/dashboard" className="hover:text-gray-300">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/diagrams" className="hover:text-gray-300">
              Diagrams
            </Link>
          </li>
          <li>
            <Link href="/groups" className="hover:text-gray-300">
              Groups
            </Link>
          </li>
          <li>
            <Link href="/forums" className="hover:text-gray-300">
              Forums
            </Link>
          </li>
        </ul>
      </div>

>>>>>>> 0566761 (Added the News Feed on Dashboard)
      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100">
        {/* News Feed */}
        <div className="relative bg-white shadow rounded-lg overflow-hidden mb-6 h-64 h-[500px]">
=======
=======
>>>>>>> d5516cc0f20e428ab377cadcf8fb2ff2a5c34020
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Top Section: News Feed & Greeting */}
      <div className="flex-1 p-6">
        <div className="relative bg-white shadow rounded-lg overflow-hidden mb-6 h-[500px]">
<<<<<<< HEAD
>>>>>>> d5516cc (Modified the dashboard and forums page)
=======
>>>>>>> d5516cc0f20e428ab377cadcf8fb2ff2a5c34020
          <NewsFeed newsItems={newsItems} />
        </div>

        <div className="p-4 bg-white shadow rounded-lg mb-6">
          <h2 className="text-xl font-bold">
<<<<<<< HEAD
            Greetings {response.userData.firstName} {response.userData.lastName}
=======
            You are {response.userData.firstName} {response.userData.lastName}
>>>>>>> 0566761 (Added the News Feed on Dashboard)
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
      </div>
    </div>
  );
}
