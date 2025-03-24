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

  export default function CreateInviteCard({ inviteData } : any) {
    const router = useRouter();

    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

    const accInvite = async () => {
        console.log("Group join id: " + inviteData.groupId)
        let response = await acceptInvite(inviteData.recvId, inviteData.groupId);
        console.log(response);
        if (response.accepted == true) {
            toast("Accepted Invite!", {
                action: {
                  label: "Close"
                }
            });
            router.refresh();
        }
        else {
            toast("Failed to Accept", {
                action: {
                  label: "Close"
                }
            });
            router.refresh();
        }
    }

    const rejInvite = async () => {
        let response = await declineInvite(inviteData.recvId, inviteData.groupId);
        if (response.declined == true) {
            toast("Declined Invite!", {
                action: {
                    label: "Close"
                }
            });
            router.refresh();
        }
        else {
            toast("Failed to Decline", {
                action: {
                  label: "Close"
                }
            });
            router.refresh();
        }
    }

    return (
        <Card className="w-[100%] h-auto m-5">
            <CardHeader>
                <CardTitle>You have been invited to {inviteData.name} by {inviteData.username}</CardTitle>
                <CardDescription>Group Description: {inviteData.group_desc}</CardDescription>
            </CardHeader>
            <CardFooter className="flex items-center justify-center">
                <Button className="mr-4" onClick={accInvite}>Accept</Button>
                <Button className="ml-4" variant="destructive" onClick={rejInvite}>Decline</Button>
            </CardFooter>
        </Card>
    )
  }