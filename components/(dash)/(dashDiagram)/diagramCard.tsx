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
  import React, { useState, useEffect, useCallback, useRef } from "react";

  export default function CreateDiagramCard({ diagramData, isHomepage } : {any, boolean}) {
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

    const [imageExists, setImageExists] = useState(true);

    const imageUrl = "https://dbm-project-customiconimages.nyc3.digitaloceanspaces.com/testingUploads/" + diagramData.id + "--thumbnail"; // Example cloud URL
    const fallbackImage = "/resources/ExampleDiagram.png"; // Fallback image
  
    useEffect(() => {
      // Function to check if the image exists
      console.log(imageUrl);
      const checkImageExists = async () => {
        try {
          const response = await fetch(imageUrl, { method: 'HEAD' });
          if (response.ok) {
            setImageExists(true); // Image exists in cloud
          } else {
            setImageExists(false); // Image doesn't exist
          }
        } catch (error) {
          setImageExists(false); // Error (image not accessible)
        }
      };
  
      checkImageExists();
    }, [imageUrl]);

    return (
        <Card className="w-[100%] h-auto m-5">
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
                <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                    <Image 
                        src={imageExists ? imageUrl : fallbackImage}
                        layout="fill"
                        objectFit="contain"
                    />
                </div>
            </CardContent>
            <CardFooter className="flex flex-wrap justify-around">
                <Link href={"/projectEditor/" + diagramData.id}>
                    <Button>Open</Button>
                </Link>
                {!isHomepage ? (
                  <>
                  <CreateEditDiagramDialog diagramId={diagramData.id} diagramName={diagramData.name} diagramDesc={diagramData.description}/>
                  <Button variant="destructive" onClick={destroyDiagram}>Destroy</Button>
                  </>
                ) : (
                  <></>
                )}
            </CardFooter>
        </Card>
    )
  }