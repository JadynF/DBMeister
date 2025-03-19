import authorization from '@/lib/authorization';
import CreateGroupDialog from '@/components/(dash)/(dashGroups)/groupCreateDialog'
import CreateGroupCard from '@/components/(dash)/(dashGroups)/groupCard'
import Link from 'next/link';

export default async function Group() {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await authorization();

    const payload = {
        id: response.userData.id
    }

    const res = await fetch(baseURL + '/api/getDashGroups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    let groupData = await res.json();
    groupData = groupData.data;
    console.log("GroupData: " + groupData);

    return (
        <div> 
            <div className="flex items-center justify-center w-full bg-[#bfdbfe] mb-6">
                <h1 className="m-4 text-3xl font-bold">My Groups</h1>
            </div>
            <div className="flex items-center justify-center"> 
                <CreateGroupDialog ownerId={response.userData.id}/>
            </div>
            
            <div className="flex flex-wrap justify-center">
                {/* Check if diagramData is an array before mapping */}
                {Array.isArray(groupData) && groupData.length > 0 ? (
                    groupData.map((group) => (
                        <div key={group.id}> {/* Ensure unique key for each item */}
                            <Link href={`/dashboard/groups/${group.id}`}>
                                <CreateGroupCard groupData={group}/>
                            </Link>
                        </div>
                    ))
                ) : (
                    <h2 className="m-4 text-xl">Once you're in a group, it will appear here!</h2> // Fallback message when there are no diagrams
                )}
            </div>

        </div>
    );
}