"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { Button } from "@/components/ui/button"
  import Image from 'next/image';
  import Link from "next/link";
  import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
  } from "@/components/ui/hover-card"
  import CreateEditDiagramDialog from '@/components/(dash)/(dashDiagram)/diagramEditDialog';
  import { useRouter } from 'next/navigation';
  import { toast } from "sonner";
  import { acceptInvite, declineInvite } from "@/lib/handleInvite";

  export default function CreateInvitedCard({ inviteData, groupId, setReload } : { any, any, any }) {
    const router = useRouter();

    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

    const cancelInvite = async () => {
        let response = await declineInvite(inviteData.id, groupId);
        console.log(inviteData);
        console.log(inviteData.id);
        console.log(groupId);
        if (response.declined == true) {
            toast("Cancelled Invite!", {
                action: {
                    label: "Close"
                }
            });
            setReload(prev => !prev);
        }
        else {
            toast("Failed to cancel", {
                action: {
                  label: "Close"
                }
            });
        }
    }

    return (
        <Card className="w-[100%] h-auto m-5">
            <CardHeader>
                <div className="flex">
                    <div className="w-[80%]">
                        <CardTitle className='text-2xl mb-1'>{inviteData.username}</CardTitle>
                        <CardTitle className='text-xl mb-3'>{inviteData.email}</CardTitle>
                        <CardDescription>UserID: {inviteData.id}</CardDescription>
                    </div>
                    <div className="w-[20%] flex items-center justify-end">
                        <Button className="ml-4" variant="destructive" onClick={cancelInvite}>Cancel Invite</Button>
                    </div>
                </div>
            </CardHeader>
        </Card>
    )
  }