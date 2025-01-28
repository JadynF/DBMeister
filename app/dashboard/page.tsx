import authorization from "@/lib/authorization";
import NewsFeed from "@/components/ui/newsfeed";
import Link from "next/link";


// Server-side component
export default async function Dashboard() {
  // Fetch user data and news feed data
  const response = await authorization();

  // Dummy news items (you can replace this with actual data from an API or database)
  const newsItems = [
    { id: 1, imgSrc: "/collab1.jpg", alt: "News 1", text:"Collaborate with DBMeister" },
    { id: 2, imgSrc: "/diagrams.jpg", alt: "News 2", text:"Create custom diagrams to your liking" },
    { id: 3, imgSrc: "/tech.jpg", alt: "News 3", text: "Louisiana Tech capstone project is going off" },
  ];

  return (
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
          <NewsFeed newsItems={newsItems} />
        </div>

        <div className="p-4 bg-white shadow rounded-lg">
          <h2 className="text-xl font-bold">
<<<<<<< HEAD
            Greetings {response.userData.firstName} {response.userData.lastName}
=======
            You are {response.userData.firstName} {response.userData.lastName}
>>>>>>> 0566761 (Added the News Feed on Dashboard)
          </h2>
          <p className="mt-2">Explore the links on the left to manage your dashboard.</p>
        </div>
      </div>
    </div>
  );
}
