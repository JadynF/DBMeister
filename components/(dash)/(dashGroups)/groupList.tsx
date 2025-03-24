"use client";

import { useState } from "react";
import Link from "next/link";
import CreateGroupCard from "@/components/(dash)/(dashGroups)/groupCard";

const DashboardGroups = ({ groupData }: { groupData: any[] }) => {
  const [visibleGroups, setVisibleGroups] = useState(groupData.slice(0, 3));
  const [showAll, setShowAll] = useState(false);

  const toggleShowAll = () => {
    if (showAll) {
      setVisibleGroups(groupData.slice(0, 3));
    } else {
      setVisibleGroups(groupData);
    }
    setShowAll(!showAll);
  };

  return (
    <div>
      <div className="flex flex-wrap justify-center">
        {Array.isArray(visibleGroups) && visibleGroups.length > 0 ? (
          visibleGroups.map((group) => (
            <div key={group.id} className="m-2">
              {/* 🟢 Wrap the card in a Link that points to /dashboard/groups/[id] */}
              <Link href={`/dashboard/groups/${group.id}`} passHref>
                <div className="cursor-pointer">
                  <CreateGroupCard groupData={group} />
                </div>
              </Link>
            </div>
          ))
        ) : (
          <h2 className="m-4 text-xl text-center">
            When you join or create groups, they will appear here!
          </h2>
        )}
      </div>

      <div className="text-center mt-4">
        <button onClick={toggleShowAll} className="text-blue-500 hover:underline">
          {showAll ? "Show Less" : "Show All Groups"}
        </button>
      </div>
    </div>
  );
};

export default DashboardGroups;
