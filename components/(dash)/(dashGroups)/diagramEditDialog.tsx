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

export default function CreateEditDiagramDialog({ diagramId, diagramName, diagramDesc, setReload } : { string, string, string, any}) {
    const router = useRouter();

    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

    const [open, setOpen] = useState(false);

    const [diagramNameInput, setDiagramName] = useState(diagramName);
    const [diagramDescInput, setDiagramDesc] = useState(diagramDesc);
    const [btnDisabled, setBtnDisabled] = useState(true);
  
    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setDiagramName(event.target.value)
      if (event.target.value != "" && (event.target.value != diagramName || diagramDescInput != diagramDesc)) {
        setBtnDisabled(false);
      }
      else {
        setBtnDisabled(true);
      }
    };
    const handleDescChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDiagramDesc(event.target.value);
        if (diagramNameInput != "" && (event.target.value != diagramDesc || diagramNameInput != diagramName)) {
            setBtnDisabled(false);
          }
          else {
            setBtnDisabled(true);
          }
    }

    const editDiagram = async () => {
        console.log("Sending request to make diagram in database");

        let payload = {
          name: diagramNameInput,
          id: diagramId,
          description: diagramDescInput
        };
    
        let res = await fetch(baseURL + '/api/editDiagram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
    
        const data = await res.json();
    
        console.log(data.response);
        if (data.response == "Edit Successful") {
          setOpen(false);
          setBtnDisabled(true);
          toast("Diagram has been edited!", {
            action: {
              label: "Close"
            }
          });
          setReload(prev => !prev);
        }
        else {
          console.log("Edit Error");
          toast("Error when editing diagram", {
            action: {
              label: "Close"
            }
          });
        }
    }
  
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>Edit Details</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Diagram Details</DialogTitle>
            <DialogDescription>
              Edit the details of your diagram here. Click done when complete.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Diagram Name
              </Label>
              <Input id="name" className="col-span-3" onChange={handleNameChange} value={diagramNameInput}/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Diagram Description
              </Label>
              <Input id="description" className="col-span-3" onChange={handleDescChange} value={diagramDescInput}/>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={editDiagram} disabled={btnDisabled}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }