'use client';

import React, { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import authorization from '@/lib/authorization';
import userInvite from '@/lib/userInvite';
import authGroup from '@/lib/authGroup';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import CreateDiagramDialog from '@/components/(dash)/(dashGroups)/diagramDialog';
import CreateDiagramCard from '@/components/(dash)/(dashGroups)/diagramCard';
import { Users, UserPlus, FileImage, Settings, Send } from "lucide-react";

export default function Group() {
    const params = useParams();

    const [groupId, setGroupId] = useState<string | undefined>(undefined);
    const [userId, setUserId] = useState<string | undefined>(undefined);
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [groupData, setGroupData] = useState<any>(null);
    const [groupDiagramData, setGroupDiagramData] = useState<any>(null);
    const [reload, setReload] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    const [invitedUser, setInvitedUser] = useState<string | undefined>(undefined);

    const handleInvitedUserChange = (event: React.ChangeEvent<HTMLInputElement>) => {setInvitedUser(event.target.value);}

    const inviteUser = async () => {
        if (invitedUser != undefined && invitedUser != "") {
            let inviteResponse = null;
            if (userId != invitedUser)
                inviteResponse = await userInvite(userId, invitedUser, groupId);
            else {
                console.log("You cant invite yourself");
                toast("You silly billy! You can't invite yourself!", {
                    action: {
                      label: "Close"
                    }
                });
                return;
            }

            if (inviteResponse.invited) {
                console.log("invited");
                toast("Invite Sent Successfully!", {
                    action: {
                      label: "Close"
                    }
                });
            }
            else if (inviteResponse.res == 'no user') {
                console.log("user not found");
                toast("Invite Failed! User Not Found!", {
                    action: {
                      label: "Close"
                    }
                });
            }
            else if (inviteResponse.res == 'in group') {
                console.log("user already in group");
                toast("User already in group!", {
                    action: {
                      label: "Close"
                    }
                });
            }
            else {
                console.log("unknown error");
                toast("Invite Failed!", {
                    action: {
                      label: "Close"
                    }
                });
            }
        }
        setInvitedUser("");
    }

    useEffect(() => {
        if (params.id) {
            setGroupId(params.id);
        }
        const checkAuth = async () => {
            const authResponse = await authorization();
            if (authResponse) {
                setUserId(authResponse.userData.id);
                let gAuth = await authGroup(authResponse.userData.id, params.id);
                console.log(gAuth);
                if (!gAuth || !gAuth[0].authorized)
                    return;
                setIsAuth(gAuth[0].authorized);
                setGroupData(gAuth[1][0]);
                setGroupDiagramData(gAuth[1][1]);
            }
        }

        checkAuth();
    }, [reload, params.id]);

    useEffect(() => {
        if (isAuth && groupData != null && groupDiagramData != null)
            setIsLoading(false);

    }, [isAuth, groupData, groupDiagramData])

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-lg font-medium text-slate-700 dark:text-slate-300">Loading group information...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Modern Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center">
                    <Users className="mr-3 h-8 w-8 text-blue-600 dark:text-blue-400" />
                    {groupData.name}
                </h1>
                <p className="text-slate-600 dark:text-slate-300">
                    Collaborate on diagrams and manage your group
                </p>
            </div>

            {/* Tabs Container */}
            <div className="bg-white dark:bg-slate-800 shadow-sm rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                <Tabs defaultValue="GroupDiagrams" className="w-full">
                    <div className="px-6 pt-6">
                        <TabsList className={"grid w-full " + (userId == groupData.admin_id ? "grid-cols-4" : "grid-cols-3")}>
                            <TabsTrigger value="GroupDiagrams" className="flex items-center">
                                <FileImage className="mr-2 h-4 w-4" />
                                Group Diagrams
                            </TabsTrigger>
                            <TabsTrigger value="OutgoingInvites" className="flex items-center">
                                <UserPlus className="mr-2 h-4 w-4" />
                                Invites
                            </TabsTrigger>
                            <TabsTrigger value="People" className="flex items-center">
                                <Users className="mr-2 h-4 w-4" />
                                People
                            </TabsTrigger>
                            {userId == groupData.admin_id && (
                                <TabsTrigger value="ManageGroup" className="flex items-center">
                                    <Settings className="mr-2 h-4 w-4" />
                                    Manage Group
                                </TabsTrigger>
                            )}
                        </TabsList>
                    </div>

                    {/* Group Diagrams Tab */}
                    <TabsContent value="GroupDiagrams" className="p-6">
                        <div className="flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-medium text-slate-900 dark:text-white">
                                    Shared diagrams
                                </h2>
                                <CreateDiagramDialog groupId={groupData.id} setReload={setReload} />
                            </div>
                            
                            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Array.isArray(groupDiagramData) && groupDiagramData.length > 0 ? (
                                    groupDiagramData.map((diagram) => (
                                        <div key={diagram.id} className="transform transition duration-200 hover:scale-[1.02]">
                                            <CreateDiagramCard diagramData={diagram} setReload={setReload} />
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-3 flex flex-col items-center justify-center py-10 px-4 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                                        <FileImage className="h-12 w-12 text-slate-400 mb-4" />
                                        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No diagrams yet</h3>
                                        <p className="text-slate-500 dark:text-slate-400 mb-4">When you create group diagrams, they will appear here!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    {/* Outgoing Invites Tab */}
                    <TabsContent value="OutgoingInvites" className="p-6">
                        <div className="flex flex-col">
                            <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-6">
                                Invite collaborators
                            </h2>
                            
                            <div className="mb-8 p-6 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                <h3 className="text-md font-medium text-slate-800 dark:text-slate-200 mb-3">
                                    Add someone to the group
                                </h3>
                                <div className="flex gap-2">
                                    <Input 
                                        placeholder="Enter user ID" 
                                        value={invitedUser} 
                                        onChange={handleInvitedUserChange}
                                        className="max-w-md"
                                    />
                                    <Button 
                                        onClick={inviteUser}
                                        className="flex items-center gap-2"
                                    >
                                        <Send className="h-4 w-4" />
                                        Send Invite
                                    </Button>
                                </div>
                            </div>
                            
                            <div className="flex flex-col">
                                <h3 className="text-md font-medium text-slate-800 dark:text-slate-200 mb-3">
                                    Pending invitations
                                </h3>
                                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                                    <p className="text-slate-500 dark:text-slate-400 text-center py-4">
                                        Will eventually see open invites listed here
                                    </p>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* People Tab */}
                    <TabsContent value="People" className="p-6">
                        <div className="flex flex-col">
                            <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-6">
                                Group members
                            </h2>
                            
                            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-md font-medium text-slate-800 dark:text-slate-200">
                                        Members
                                    </h3>
                                    <p className="text-sm text-slate-500">
                                        Admin: {groupData.admin_id === userId ? 'You' : groupData.admin_id}
                                    </p>
                                </div>
                                
                                <p className="text-slate-500 dark:text-slate-400 text-center py-4">
                                    Group member list will be displayed here
                                </p>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Manage Group Tab */}
                    {userId == groupData.admin_id && (
                        <TabsContent value="ManageGroup" className="p-6">
                            <div className="flex flex-col">
                                <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-6">
                                    Group administration
                                </h2>
                                
                                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                                    <p className="text-slate-500 dark:text-slate-400 text-center py-4">
                                        Group management options will be available here
                                    </p>
                                </div>
                            </div>
                        </TabsContent>
                    )}
                </Tabs>
            </div>
        </>
    );
}