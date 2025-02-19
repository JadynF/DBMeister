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

  export default function CreateDiagramCard({ diagramData } : any) {

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
                <Button variant="outline">Edit Details</Button>
                <Button variant="destructive">Destroy</Button>
            </CardFooter>
        </Card>
    )
  }