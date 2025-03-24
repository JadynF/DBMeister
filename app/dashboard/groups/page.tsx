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
<<<<<<< HEAD
import { Users, UserPlus } from "lucide-react";
=======
>>>>>>> b20d873 (Added delete and edit functionality to groups)

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
            {/* Modern Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center">
                    <Users className="mr-3 h-8 w-8 text-blue-600 dark:text-blue-400" />
                    Groups
                </h1>
                <p className="text-slate-600 dark:text-slate-300">
                    Manage your groups and team collaborations
                </p>
            </div>
<<<<<<< HEAD

            {/* Tabs Container */}
            <div className="bg-white dark:bg-slate-800 shadow-sm rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                <Tabs defaultValue="MyGroups" className="w-full">
                    <div className="px-6 pt-6">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="MyGroups" className="flex items-center">
                                <Users className="mr-2 h-4 w-4" />
                                My Groups
                            </TabsTrigger>
                            <TabsTrigger value="IncomingInvites" className="flex items-center">
                                <UserPlus className="mr-2 h-4 w-4" />
                                Incoming Invites
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* My Groups Tab */}
                    <TabsContent value="MyGroups" className="p-6">
                        <div className="flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-medium text-slate-900 dark:text-white">
                                    Your groups
                                </h2>
                                <CreateGroupDialog ownerId={response.userData.id} />
                            </div>
                            
                            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {groupData.length > 0 ? (
                                    groupData.map((group) => (
                                        <Link key={group.id} href={`/dashboard/groups/${group.id}`} className="block transform transition duration-200 hover:scale-[1.02]">
                                            <CreateGroupCard groupData={group} currentUserId={response.userData.id} />
                                        </Link>
                                    ))
                                ) : (
                                    <div className="col-span-3 flex flex-col items-center justify-center py-10 px-4 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                                        <Users className="h-12 w-12 text-slate-400 mb-4" />
                                        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No groups yet</h3>
                                        <p className="text-slate-500 dark:text-slate-400 mb-4">Create a group to collaborate with others</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    {/* Incoming Invites Tab */}
                    <TabsContent value="IncomingInvites" className="p-6">
                        <div className="flex flex-col">
                            <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-6">
                                Pending invitations
                            </h2>
                            
                            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {inviteData.length > 0 ? (
                                    inviteData.map((invite) => (
                                        <div key={invite.groupId}>
                                            <CreateInviteCard inviteData={invite} />
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-3 flex flex-col items-center justify-center py-10 px-4 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                                        <UserPlus className="h-12 w-12 text-slate-400 mb-4" />
                                        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No pending invites</h3>
                                        <p className="text-slate-500 dark:text-slate-400">You'll see invites from others here</p>
                                    </div>
                                )}
                            </div>
=======
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
>>>>>>> b20d873 (Added delete and edit functionality to groups)
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}
