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

export default function CreateGroupDialog({ ownerId } : string) {
    const router = useRouter();

    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    const [open, setOpen] = useState(false);

    const [diagramName, setDiagramName] = useState("");
    const [diagramDesc, setDiagramDesc] = useState("");
    const [btnDisabled, setBtnDisabled] = useState(true);

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDiagramName(event.target.value)
        if (event.target.value != "") {
          setBtnDisabled(false);
        }
        else {
          setBtnDisabled(true);
        }
      };
    
    const handleDescChange = (event: React.ChangeEvent<HTMLInputElement>) => setDiagramDesc(event.target.value);

    const createGroup = async () => {
        console.log("Sending request to make group in database");
    
        let payload = {
          name: diagramName,
          owner: ownerId,
          description: diagramDesc
        };
    
        let res = await fetch(baseURL + '/api/makeGroup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
    
        const data = await res.json();
    
        console.log(data.response);
        if (data.response == "Creation Successful") {
          setOpen(false);
          setBtnDisabled(true);
          setDiagramName("");
          setDiagramDesc("");
          toast("Group has been created!", {
            action: {
              label: "Close"
            }
          });
          router.refresh();
        }
        else {
          console.log("Creation Error");
          toast("Error when creating new group", {
            action: {
              label: "Close"
            }
          });
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="py-8 px-8 text-lg">Create Group</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Create Group</DialogTitle>
              <DialogDescription>
                Create a group here. Click create when you are done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Group Name
                </Label>
                <Input id="name" className="col-span-3" onChange={handleNameChange}/>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Group Description
                </Label>
                <Input id="description" className="col-span-3" onChange={handleDescChange}/>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={createGroup} disabled={btnDisabled}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    )
}