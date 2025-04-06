"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useState } from "react"
import { useRouter } from 'next/navigation';
import Router from "next/router";

export default function LeaveGroupDialog({ groupId, userId } : {string, any}) {
  const router = useRouter();

  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [open, setOpen] = useState(false);

  const handleLeave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await fetch('/api/leaveGroup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId: groupId, userId: userId }),
      });

      console.log(response);

      if (response.response == "Error" || response.status == 500) {
        toast("Error when leaving group", {
          action: {
            label: "Close"
          }
        });
      }
      else {
        toast("Successfully left group!", {
          action: {
            label: "Close"
          }
        });
        router.push('/dashboard/groups');
      }
      // Optionally: refresh the page or update state
    } catch (error) {
      console.error(error);
      toast("Error when leaving group", {
        action: {
          label: "Close"
        }
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="py-8 px-8 text-lg">Leave Group</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            You are about to leave this group. You will lose access to all of its diagrams!
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive" onClick={handleLeave}>Leave Group</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
