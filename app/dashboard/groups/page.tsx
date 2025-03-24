import authorization from '@/lib/authorization';
import CreateGroupDialog from '@/components/(dash)/(dashGroups)/groupCreateDialog';
import CreateGroupCard from '@/components/(dash)/(dashGroups)/groupCard';
import CreateInviteCard from '@/components/(dash)/(dashGroups)/inviteCard';
import Link from 'next/link';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default async function Group() {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await authorization();

    const payload = {
        id: response.userData.id
    };

    let res = await fetch(baseURL + '/api/getDashGroups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    let returnedData = await res.json();
    let groupData = returnedData.data[0] || [];
    let inviteData = returnedData.data[1] || [];

    return (
        <>
            <div className="flex items-center justify-center w-full bg-[#bfdbfe] mb-3">
                <h1 className="m-4 text-3xl font-bold">Groups</h1>
            </div>
            <div className="flex items-center justify-center w-full mb-6">
                <h2 className="text-xl">Your user ID: {response.userData.id}</h2>
            </div>
            <Tabs defaultValue="MyGroups" className="w-[100%]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="MyGroups">My Groups</TabsTrigger>
                    <TabsTrigger value="IncomingInvites">Incoming Invites</TabsTrigger>
                </TabsList>

                {/* My Groups Tab */}
                <TabsContent value="MyGroups">
                    <div className="flex flex-col items-center">
                        <CreateGroupDialog ownerId={response.userData.id} />
                        <div className="w-full flex flex-wrap justify-center gap-4 mt-4">
                            {groupData.length > 0 ? (
                                groupData.map((group) => (
                                    <Link key={group.id} href={`/dashboard/groups/${group.id}`} className="block">
                                        <CreateGroupCard groupData={group} currentUserId={response.userData.id} />
                                    </Link>
                                ))
                            ) : (
                                <h2 className="m-4 text-xl text-center">Once you're in a group, it will appear here!</h2>
                            )}
                        </div>
                    </div>
                </TabsContent>

                {/* Incoming Invites Tab */}
                <TabsContent value="IncomingInvites">
                    <div className="flex flex-col items-center">
                        <div className="w-full flex flex-wrap justify-center gap-4">
                            {inviteData.length > 0 ? (
                                inviteData.map((invite) => (
                                    <div key={invite.groupId} className="block">
                                        <CreateInviteCard inviteData={invite} />
                                    </div>
                                ))
                            ) : (
                                <h2 className="m-4 text-xl text-center">Once you've received an invite, it will appear here!</h2>
                            )}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </>
    );
}
