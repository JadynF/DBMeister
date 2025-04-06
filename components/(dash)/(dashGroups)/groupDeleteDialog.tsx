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

export default function DeleteGroupDialog({ groupId } : {string, any}) {
  const router = useRouter();

  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [open, setOpen] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await fetch('/api/deleteGroup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId: groupId }),
      });

      toast("Group successfully deleted!", {
        action: {
          label: "Close"
        }
      });
      router.push('/dashboard/groups');
      // Optionally: refresh the page or update state
    } catch (error) {
      console.error(error);
      toast("Error when deleting group!", {
        action: {
          label: "Close"
        }
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="py-8 px-8 text-lg w-[25%]">Delete Group</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This can NOT be undone! Deleting a group will also delete all diagrams assocated with it!
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive" onClick={handleDelete}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
