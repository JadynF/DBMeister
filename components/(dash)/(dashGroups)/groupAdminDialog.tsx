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

export default function GroupAdminDialog({ groupId, userId, setReload } : {string, string, any}) {
  const router = useRouter();

  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [open, setOpen] = useState(false);

  const handleAdmin = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await fetch('/api/changeGroupAdmin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId: groupId, userId: userId }),
      });

      toast("Admin successfully changed!", {
        action: {
          label: "Close"
        }
      });
      setReload(prev => !prev);
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast("Error when changing admin", {
        action: {
          label: "Close"
        }
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="py-8 px-8 text-lg">Make Group Admin</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This can NOT be undone! You will no longer be the admin of this group!
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive" onClick={handleAdmin}>Make Group Admin</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
