import authorization from '@/lib/authorization';
import CreateGroupDialog from '@/components/(dash)/(dashGroups)/groupCreateDialog'
import CreateGroupCard from '@/components/(dash)/(dashGroups)/groupCard'
import CreateInviteCard from '@/components/(dash)/(dashGroups)/inviteCard'
import Link from 'next/link';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export default async function Group() {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await authorization();

    const payload = {
        id: response.userData.id
    }

    let res = await fetch(baseURL + '/api/getDashGroups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    let returnedData = await res.json();
    let groupData = returnedData.data[0];
    console.log("GroupData: " + groupData);

    let inviteData = returnedData.data[1];
    console.log("InviteData: " + inviteData);

    return (
        <Tabs defaultValue="MyGroups" className="w-[100%]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="MyGroups">My Groups</TabsTrigger>
              <TabsTrigger value="IncomingInvites">Incoming Invites</TabsTrigger>
            </TabsList>
            <TabsContent value="MyGroups">
            <div> 
                <div className="flex items-center justify-center w-full bg-[#bfdbfe] mb-6">
                    <h1 className="m-4 text-3xl font-bold">My Groups</h1>
                </div>
                <div className="flex items-center justify-center"> 
                    <CreateGroupDialog ownerId={response.userData.id}/>
                </div>

                <div className="flex flex-col flex-wrap justify-center w-[100%]">
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
            </TabsContent>
            <TabsContent value="IncomingInvites">
                <div>
                    <div className="flex items-center justify-center w-full bg-[#bfdbfe] mb-6">
                        <h1 className="m-4 text-3xl font-bold">Incoming Invites</h1>
                    </div>

                    <div className="flex flex-col flex-wrap justify-center w-[100%]">
                        {/* Check if diagramData is an array before mapping */}
                        {Array.isArray(inviteData) && inviteData.length > 0 ? (
                            inviteData.map((invite) => (
                                <div key={invite.groupId}> {/* Ensure unique key for each item */}
                                    <CreateInviteCard inviteData={invite}/>
                                </div>
                            ))
                        ) : (
                            <h2 className="m-4 text-xl">Once you've received an invite it will appear here!</h2> // Fallback message when there are no diagrams
                        )}
                    </div>
                </div>
            </TabsContent>
        </Tabs>
    );
}