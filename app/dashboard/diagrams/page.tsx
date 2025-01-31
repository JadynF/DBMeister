import authorization from '@/lib/authorization';
import CreateDiagramDialog from '@/components/(dash)/(dashDiagram)/diagramDialog';
import CreateDiagramCard from '@/components/(dash)/(dashDiagram)/diagramCard'

export default async function Dashboard() {
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
        <div> 
            <div className="flex items-center justify-center w-full bg-[#bfdbfe] mb-6">
                <h1 className="m-4 text-3xl font-bold">Diagram Page</h1>
            </div>
            <div className="flex items-center justify-center"> 
                <CreateDiagramDialog ownerId={response.userData.id}/>
            </div>
            
            <div className="flex flex-wrap justify-center">
                {/* Check if diagramData is an array before mapping */}
                {Array.isArray(diagramData) && diagramData.length > 0 ? (
                    diagramData.map((diagram) => (
                        <div key={diagram.id}> {/* Ensure unique key for each item */}
                            <CreateDiagramCard diagramData={diagram}/>
                        </div>
                    ))
                ) : (
                    <h2 className="m-4 text-xl">When you create personal diagrams, they will appear here!</h2> // Fallback message when there are no diagrams
                )}
            </div>

        </div>
    );
}