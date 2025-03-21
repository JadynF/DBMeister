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

  export default function CreateGroupCard({ groupData } : any) {
    const router = useRouter();

    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

    return (
        <Card className="w-[100%] h-auto m-5">
            <CardHeader>
                <CardTitle>{groupData.name}</CardTitle>
                <CardDescription>{groupData.group_desc}</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-around">
            </CardFooter>
        </Card>
    )
  }