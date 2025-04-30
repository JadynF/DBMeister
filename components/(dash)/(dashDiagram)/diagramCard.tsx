"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import CreateEditDiagramDialog from "@/components/(dash)/(dashDiagram)/diagramEditDialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import React, { useState, useEffect } from "react";

export default function CreateDiagramCard({
  diagramData,
  isHomepage,
}: {
  diagramData: any;
  isHomepage: boolean;
}) {
  const router = useRouter();
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL!;

  const [imageExists, setImageExists] = useState(true);
  const imageUrl =
    "https://dbm-project-customiconimages.nyc3.digitaloceanspaces.com/testingUploads/" +
    diagramData.id +
    "--thumbnail";
  const fallbackImage = "/resources/ExampleDiagram.png";

  useEffect(() => {
    const checkImageExists = async () => {
      try {
        const res = await fetch(imageUrl, { method: "HEAD" });
        setImageExists(res.ok);
      } catch {
        setImageExists(false);
      }
    };
    checkImageExists();
  }, [imageUrl]);

  const destroyDiagram = async () => {
    const res = await fetch(`${baseURL}/api/destroyDiagram`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: diagramData.id }),
    });
    const data = await res.json();
    if (data.response === "Deletion Successful") {
      toast.success("Diagram has been destroyed!");
      router.refresh();
    } else {
      toast.error("Error when destroying diagram");
    }
  };

  return (
    <Card className="group w-full max-w-sm m-4 overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-lg transition-shadow hover:shadow-2xl">
      {/* Image Preview */}
      <div className="relative w-full pb-[56.25%]">
        <Image
          src={imageExists ? imageUrl : fallbackImage}
          alt={diagramData.name}
          fill
          className="object-cover rounded-t-2xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <h3 className="absolute bottom-3 left-4 text-white font-semibold text-lg drop-shadow opacity-0 group-hover:opacity-100 transition-opacity">
          {diagramData.name}
        </h3>
      </div>

      {/* Description */}
      <CardContent className="pt-4 pb-2">
        {diagramData.description.length < 80 ? (
          <CardDescription className="text-gray-700 dark:text-slate-300">
            {diagramData.description}
          </CardDescription>
        ) : (
          <HoverCard>
            <HoverCardTrigger>
              <CardDescription className="text-gray-700 dark:text-slate-300 cursor-pointer hover:underline">
                {diagramData.description.slice(0, 80) + "..."}
              </CardDescription>
            </HoverCardTrigger>
            <HoverCardContent className="w-64">
              <div className="text-gray-800 dark:text-slate-200 whitespace-pre-wrap">
                {diagramData.description}
              </div>
            </HoverCardContent>
          </HoverCard>
        )}
      </CardContent>

      {/* Actions */}
      <CardFooter className="flex flex-wrap justify-between gap-2 px-4 py-3">
        <Link href={`/projectEditor/${diagramData.id}`} className="flex-1">
          <Button className="w-full">Open</Button>
        </Link>

        {!isHomepage && (
          <>
            <CreateEditDiagramDialog
              diagramId={diagramData.id}
              diagramName={diagramData.name}
              diagramDesc={diagramData.description}
            />
            <Button
              variant="destructive"
              onClick={destroyDiagram}
              className="w-full"
            >
              Destroy
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
