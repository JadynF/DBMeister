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
import { Users, UserPlus, FileImage, Settings, Send, Delete } from "lucide-react";
import DeleteGroupDialog from '@/components/(dash)/(dashGroups)/groupDeleteDialog';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { group } from "console";
import LeaveGroupDialog from "@/components/(dash)/(dashGroups)/groupLeaveDialog";
import CreateInvitedCard from "@/components/(dash)/(dashGroups)/groupInvitedCard";
import CreateMemberCard from "@/components/(dash)/(dashGroups)/groupMemberCard";
import InviteComboBox from "@/components/(dash)/(dashGroups)/sendInviteDropdown";

export default function Group() {
    const params = useParams();

    const [groupId, setGroupId] = useState<string | undefined>(undefined);
    const [userId, setUserId] = useState<string | undefined>(undefined);
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [groupData, setGroupData] = useState<any>(null);
    const [groupDiagramData, setGroupDiagramData] = useState<any>(null);
    const [reload, setReload] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [groupName, setGroupName] = useState<string | undefined>("");
    const [groupDesc, setGroupDesc] = useState<string | undefined>("");
    const [groupInvites, setGroupInvites] = useState<any>(undefined);
    const [groupMembers, setGroupMembers] = useState<any>(undefined);
    
    const [invitedUser, setInvitedUser] = useState<string | undefined>(undefined);

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
                setReload(prev => !prev);
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
            console.log(params.id);
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
                setGroupInvites(gAuth[1][2]);
                setGroupMembers(gAuth[1][3]);
                //setGroupName(gAuth[1][0].name);
                //setGroupDesc(gAuth[1][0].group_desc)
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
    
    const handleEdit = async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      let editName = groupName;
      let editDesc = groupDesc;

      if (editName.trim() == "") {
        editName = groupData.name;
        if (!groupData.name) {
            editName = ""
        }
      }
      
      try {
        const response = await fetch('/api/editGroup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            groupId: groupId,
            name: editName,
            description: editDesc
          }),
        });

        toast("Group edit successful!", {
            action: {
              label: "Close"
            }
        });
        setGroupName("");
        setGroupDesc("");
        setReload(prev => !prev);

      } catch (error) {
        console.error(error);
        toast("Group edit failed", {
            action: {
              label: "Close"
            }
        });
      }
    };

    const handleGroupNameChange = (event: React.ChangeEvent<HTMLInputElement>) => setGroupName(event.target.value);
    const handleGroupDescChange = (event: React.ChangeEvent<HTMLInputElement>) => setGroupDesc(event.target.value);

    return (
        <>
            {/* Modern Page Header */}
            <div className="mb-6 flex">
                <div className="w-[80%]">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center">
                        <Users className="mr-3 h-8 w-8 text-blue-600 dark:text-blue-400" />
                        {groupData.name}
                    </h1>
                    {groupData.group_desc ? (
                        <h2 className="mb-4 text-xl">
                            {groupData.group_desc}
                        </h2>
                    ) : (
                        <></>
                    )}
                </div>
                <div className="w-[20%] flex justify-end">
                    {groupData.admin_id != userId ? (
                        <LeaveGroupDialog groupId={groupId} userId={userId}/>
                    ) : (
                        <></>
                    )}
                </div>
            </div>

            {/* Tabs Container */}
            <div className="bg-white dark:bg-slate-800 shadow-sm rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                <p className="text-slate-600 dark:text-slate-300 m-2">
                    Collaborate on diagrams and manage your group
                </p>
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
                                <CreateDiagramDialog groupId={groupData.id} setReload={setReload}/>
                            </div>
                            
                            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Array.isArray(groupDiagramData) && groupDiagramData.length > 0 ? (
                                    groupDiagramData.map((diagram) => (
                                        <div key={diagram.id} className="transform transition duration-200 hover:scale-[1.02]">
                                            <CreateDiagramCard diagramData={diagram} setReload={setReload} isAdmin={userId == groupData.admin_id}/>
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
                                    <InviteComboBox groupId={groupId} setSelectedId={setInvitedUser} reload={reload}/>
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
                                {Array.isArray(groupInvites) && groupInvites.length > 0 ? (
                                    groupInvites.map((invite) => (
                                        <div key={invite.id} className="transform transition duration-200 hover:scale-[1.02]">
                                            <CreateInvitedCard inviteData={invite} groupId={groupId} setReload={setReload} />
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
                                </div>
                                
                                {Array.isArray(groupMembers) && groupMembers.length > 0 ? (
                                    groupMembers.map((member) => (
                                        <div key={member.id} className="transform transition duration-200 hover:scale-[1.02]">
                                            <CreateMemberCard memberData={member} groupId={groupId} adminId={groupData.admin_id} myId={userId} setReload={setReload} />
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

                    {/* Manage Group Tab */}
                    {userId == groupData.admin_id && (
                        <TabsContent value="ManageGroup" className="p-6">
                            <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-6">
                                    Group administration
                            </h2>
                            <div className="flex flex-col justify-center items-center">

                                <Card className="border border-slate-200 dark:border-slate-700 min-w-[50%] max-w-full mb-8">
                                    <CardHeader className="bg-slate-50 dark:bg-slate-800/60">
                                        <CardTitle className="text-md font-medium">Edit Group Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <div className="space-y-4">
                                            <div className="flex flex-col space-y-2">
                                                <Label htmlFor="username" className="font-medium text-slate-800 dark:text-slate-200">New Group Name</Label>
                                                <Input 
                                                    id="groupName" 
                                                    placeholder="Enter new group name"
                                                    className="border-slate-200 dark:border-slate-700"
                                                    value={groupName}
                                                    onChange={handleGroupNameChange}
                                                />
                                            </div>

                                            <div className="flex flex-col space-y-2">
                                                <Label htmlFor="password" className="font-medium text-slate-800 dark:text-slate-200">New Group Description</Label>
                                                <Input 
                                                    id="groupDesc" 
                                                    placeholder="Enter new group description"
                                                    className="border-slate-200 dark:border-slate-700" 
                                                    value={groupDesc}
                                                    onChange={handleGroupDescChange}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-end border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 px-6 py-4">
                                        <Button 
                                            onClick={handleEdit}
                                            className="bg-blue-600 hover:bg-blue-700 text-white"
                                        >
                                            Update Group Information
                                        </Button>
                                    </CardFooter>
                                </Card>

                                <DeleteGroupDialog groupId={groupId}/>
                            </div>
                        </TabsContent>
                    )}
                </Tabs>
            </div>
        </>
    );
}