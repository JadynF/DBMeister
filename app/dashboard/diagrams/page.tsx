import React from "react";
import authorization from '@/lib/authorization';
import CreateDiagramDialog from '@/components/(dash)/(dashDiagram)/diagramDialog';
import CreateDiagramCard from '@/components/(dash)/(dashDiagram)/diagramCard';
import { FileImage } from "lucide-react";

export default async function Diagrams() {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await authorization();

    const payload = {
        id: response.userData.id
    }

    const res = await fetch(baseURL + '/api/getDashDiagrams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    let diagramData = await res.json();
    diagramData = diagramData.data;
    console.log(diagramData);

    return (
        <>
            {/* Modern Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center">
                    <FileImage className="mr-3 h-8 w-8 text-blue-600 dark:text-blue-400" />
                    Personal Diagrams
                </h1>
                <p className="text-slate-600 dark:text-slate-300">
                    Create and manage your personal diagram collection
                </p>
            </div>

            {/* Content Container */}
            <div className="bg-white dark:bg-slate-800 shadow-sm rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden p-6">
                <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-medium text-slate-900 dark:text-white">
                            Your diagrams
                        </h2>
                        <CreateDiagramDialog ownerId={response.userData.id} />
                    </div>
                    
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.isArray(diagramData) && diagramData.length > 0 ? (
                            diagramData.map((diagram) => (
                                <div key={diagram.id} className="transform transition duration-200 hover:scale-[1.02] w-[75%]">
                                    <CreateDiagramCard diagramData={diagram} />
                                </div>
                            ))
                        ) : (
                            <div className="col-span-3 flex flex-col items-center justify-center py-10 px-4 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                                <FileImage className="h-12 w-12 text-slate-400 mb-4" />
                                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No diagrams yet</h3>
                                <p className="text-slate-500 dark:text-slate-400 mb-4">When you create personal diagrams, they will appear here!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}