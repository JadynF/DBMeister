'use client';

import React, { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import authorization from '@/lib/authorization';
import userInvite from '@/lib/userInvite';
import authGroup from '@/lib/authGroup';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Group() {
    const params = useParams();

    const [groupId, setGroupId] = useState<string | undefined>(undefined);
    const [userId, setUserId] = useState<string | undefined>(undefined);
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [groupData, setGroupData] = useState<any>(false);
    
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
                setIsAuth(gAuth);
            }
        }

        checkAuth();
    }, []);


    return (
        <div> 
            <div className="flex items-center justify-center w-full bg-[#bfdbfe] mb-6">
                <h1 className="m-4 text-3xl font-bold">Group {groupId}</h1>
            </div>

            <div className="flex items-center justify-center">
                <h2>Invite Others</h2>
            </div>
            <div className="flex items-center justify-center">
                <div className="flex items-center justify-center w-[40%]">
                    <Input placeholder="User ID" value={invitedUser} onChange={handleInvitedUserChange}/>
                    <Button onClick={inviteUser}>Invite!</Button>
                </div>
            </div>

        </div>
    );
}