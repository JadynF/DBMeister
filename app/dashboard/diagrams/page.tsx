import authorization from '@/lib/authorization';
import CreateDiagramDialog from '@/components/diagramDialog';

export default async function Dashboard() {

    const response = await authorization();

    return (
        <div>
            <h1>Diagram Page</h1>

            <div> 
                <CreateDiagramDialog ownerId={response.userData.id}/>
            </div>

        </div>
    );
}