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
  import GroupAdminDialog from "@/components/(dash)/(dashGroups)/groupAdminDialog";

  export default function CreateMemberCard({ memberData, groupId, adminId, myId, setReload } : { any, string, string, string, any }) {
    const router = useRouter();

    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

    const kickMember = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    
        try {
          const response = await fetch('/api/leaveGroup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ groupId: groupId, userId: memberData.id }),
          });
    
          toast("Successfully kicked member!", {
            action: {
              label: "Close"
            }
          });
          setReload(prev => !prev);

        } catch (error) {
          console.error(error);
          toast("Error when kicking member", {
            action: {
              label: "Close"
            }
          });
        }
    };

    return (
        <Card className="w-[100%] h-auto m-5">
            <CardHeader>
                <div className="flex">
                    <div className="w-[80%]">
                        <CardTitle className='text-2xl mb-1'>{memberData.username}</CardTitle>
                        <CardTitle className='text-xl mb-3'>{memberData.email}</CardTitle>
                        <CardDescription>UserID: {memberData.id}</CardDescription>
                    </div>
                    { adminId == myId && memberData.id != myId ? (
                      <div className="w-[20%] flex items-center justify-end flex-wrap">
                        <GroupAdminDialog groupId={groupId} userId={memberData.id} setReload={setReload}/>
                        <Button className="ml-4 text-lg" variant="destructive" onClick={kickMember}>Kick</Button>
                      </div>
                    ) : memberData.id == myId ? (
                      <div className="w-[20%] flex items-center justify-end opacity-40">
                        It's You!
                      </div>
                    ) : memberData.id == adminId ? (
                      <div className="w-[20%] flex items-center justify-end opacity-40 color-red">
                        Group Admin
                      </div>
                    ) : (
                      <></>
                    )}
                </div>
            </CardHeader>
        </Card>
    )
  }