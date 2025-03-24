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
import CreateDiagramCard from '@/components/(dash)/(dashGroups)/diagramCard'

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
        if (userInvite != undefined || userInvite != "") {
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
    }, [reload]);

    useEffect(() => {
        if (isAuth && groupData != null && groupDiagramData != null)
            setIsLoading(false);

    }, [isAuth, groupData, groupDiagramData])


    return (
        isLoading ? 
            <div className="flex justify-center items-center h-screen text-lg font-semibold">
                Loading...
            </div>
        : 
            <div> 
                <div className="flex items-center justify-center w-full bg-[#bfdbfe] mb-6">
                    <h1 className="m-4 text-3xl font-bold">{groupData.name}</h1>
                </div>
            
                <Tabs defaultValue="GroupDiagrams">
                    <TabsList className={"grid w-full " + (userId == groupData.admin_id ? "grid-cols-4" : "grid-cols-3")}>
                      <TabsTrigger value="GroupDiagrams">Group Diagrams</TabsTrigger>
                      <TabsTrigger value="OutgoingInvites">Outgoing Invites</TabsTrigger>
                      <TabsTrigger value="People">People</TabsTrigger>
                      {userId == groupData.admin_id ? <TabsTrigger value="ManageGroup">Manage Group</TabsTrigger> : null}
                    </TabsList>
                    <TabsContent value="GroupDiagrams">
                        <div className="flex items-center justify-center"> 
                            <CreateDiagramDialog groupId={groupData.id} setReload={setReload}/>
                        </div>
                        <div className="flex flex-wrap justify-center">
                            {/* Check if diagramData is an array before mapping */}
                            {Array.isArray(groupDiagramData) && groupDiagramData.length > 0 ? (
                                groupDiagramData.map((diagram) => (
                                    <div key={diagram.id}> {/* Ensure unique key for each item */}
                                        <CreateDiagramCard diagramData={diagram} setReload={setReload}/>
                                    </div>
                                ))
                            ) : (
                                <h2 className="m-4 text-xl">When you create group diagrams, they will appear here!</h2> // Fallback message when there are no diagrams
                            )}
                        </div>
                        
                    </TabsContent>
                    <TabsContent value="OutgoingInvites">
                    <div className="flex items-center justify-center">
                        <h2>Invite Others</h2>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center justify-center w-[40%] mb-4">
                            <Input placeholder="User ID" value={invitedUser} onChange={handleInvitedUserChange}/>
                            <Button onClick={inviteUser}>Invite!</Button>
                        </div>
                        <p>Will eventually see open invites listed here</p>
                    </div>
                    </TabsContent>
                    <TabsContent value="People">
                        People
                    </TabsContent>
                    <TabsContent value="ManageGroup">
                        Manage
                    </TabsContent>
                </Tabs>
                        
            </div>
        
    );
}