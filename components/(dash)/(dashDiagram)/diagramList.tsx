// components/(dash)/(dashDiagram)/diagramList
=======
// components/DashboardDiagrams.tsx

>>>>>>> origin/Jacob-NextJS
"use client";

import { useState } from "react";
import CreateDiagramCard from "@/components/(dash)/(dashDiagram)/diagramCard";

const DashboardDiagrams = ({ diagramData }: { diagramData: any[] }) => {
  // Only show 3 diagrams initially
  const [visibleDiagrams, setVisibleDiagrams] = useState(diagramData.slice(0, 3));
  const [showAll, setShowAll] = useState(false);

  // Handle toggle button click
  const toggleShowAll = () => {
    if (showAll) {
      setVisibleDiagrams(diagramData.slice(0, 3));
    } else {
      setVisibleDiagrams(diagramData);
    }
    setShowAll(!showAll);
  };

  return (
    <div>
      <div className="flex flex-wrap justify-center">
        {Array.isArray(visibleDiagrams) && visibleDiagrams.length > 0 ? (
          visibleDiagrams.map((diagram) => (
            <div key={diagram.id} className="m-2">
              <CreateDiagramCard diagramData={diagram} />
            </div>
          ))
        ) : (
          <h2 className="m-4 text-xl text-center">
            When you create personal diagrams, they will appear here!
          </h2>
        )}
      </div>

      <div className="text-center mt-4">
        <button
          onClick={toggleShowAll}
          className="text-blue-500 hover:underline"
        >
          {showAll ? "Show Less" : "Show All Diagrams"}
        </button>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default DashboardDiagrams;
=======
export default DashboardDiagrams;
>>>>>>> origin/Jacob-NextJS
