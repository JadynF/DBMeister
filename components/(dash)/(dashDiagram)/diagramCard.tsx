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

  export default function CreateDiagramCard({ diagramData } : any) {
    const router = useRouter();

    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

    const destroyDiagram = async () => {
        let payload = {
            id: diagramData.id,
          };
      
          let res = await fetch(baseURL + '/api/destroyDiagram', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
      
          const data = await res.json();

          if (data.response == "Deletion Successful") {
                toast("Diagram has been destroyed!", {
                action: {
                  label: "Close"
                }
                });
                router.refresh();
          }
          else {
            toast("Error when destroying diagram", {
                action: {
                  label: "Close"
                }
              });
          }
    }

    return (
        <Card className="w-[350px] h-auto m-5">
            <CardHeader>
                <CardTitle>{diagramData.name}</CardTitle>
                {diagramData.description.length < 80 ? (
                    <CardDescription>{diagramData.description}</CardDescription>
                ) : (
                    <HoverCard>
                        <HoverCardTrigger>
                            <CardDescription className="hover:cursor-pointer">{diagramData.description.slice(0, 80) + "..."}</CardDescription>
                        </HoverCardTrigger>
                        <HoverCardContent>
                            <h2 className="text-xl font-bold">Description</h2>
                            <div>
                                {diagramData.description}
                            </div>
                        </HoverCardContent>
                    </HoverCard>
                )}
            </CardHeader>
            <CardContent>
                <div className="relative h-40 w-full">
                    <Image 
                        src="/resources/ExampleDiagram.png"
                        fill
                        style={{objectFit: 'contain'}}
                    />
                </div>
            </CardContent>
            <CardFooter className="flex justify-around">
                <Link href={"/projectEditor/" + diagramData.id}>
                    <Button>Open</Button>
                </Link>
                <CreateEditDiagramDialog diagramId={diagramData.id} diagramName={diagramData.name} diagramDesc={diagramData.description}/>
                <Button variant="destructive" onClick={destroyDiagram}>Destroy</Button>
            </CardFooter>
        </Card>
    )
  }