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

export default function CreateDiagramDialog({ ownerId } : string) {
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

  const createDiagram = async () => {
    console.log("Sending request to make diagram in database");

    let payload = {
      name: diagramName,
      owner: ownerId,
      description: diagramDesc
    };

    let res = await fetch(baseURL + '/api/makeDiagram', {
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
      toast("Diagram has been created!", {
        action: {
          label: "Close"
        }
      });
      router.refresh();
    }
    else {
      console.log("Creation Error");
      toast("Error when creating new diagram", {
        action: {
          label: "Close"
        }
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="py-8 px-8 text-lg">Create Diagram</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Create Diagram</DialogTitle>
          <DialogDescription>
            Create a diagram here. Click create when you are done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Diagram Name
            </Label>
            <Input id="name" className="col-span-3" onChange={handleNameChange}/>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Diagram Description
            </Label>
            <Input id="description" className="col-span-3" onChange={handleDescChange}/>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={createDiagram} disabled={btnDisabled}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
