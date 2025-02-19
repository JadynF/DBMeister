'use client';
import React, { useState, useEffect, useRef } from 'react';
import { type Node, type Edge } from '@xyflow/react';

//Import ui components
import { 
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Label } from "@/components/ui/label";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

//Function props definitions
type EdgePropertiesPaneProps = {
    selectedEdge: Edge,
    selectedStatus: boolean,
    deleteSelectedEdge: (selectedEdgeID: string) => void,
    animateEdge: (aniVal: boolean) => void
};

const EdgePropertiesPane: React.FC<EdgePropertiesPaneProps> = ({selectedEdge, selectedStatus, deleteSelectedEdge, animateEdge}) => {
    const [edgeStatus, setStatus] = useState(selectedStatus);
    const [edge, setEdge] = useState(selectedEdge);

    const [eSource, setSource] = useState(selectedEdge.source);
    const [eTarget, setTarget] = useState(selectedEdge.target);
    const [animated, setAnimation] = useState(selectedEdge.animated);

    const handleSourceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value);
        setSource(event.target.value);
    }
    const handleTargetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value);
        setTarget(event.target.value);
    }

    const handleAnimationChange = (change: boolean) => {
        setAnimation(change);
        animateEdge(change);
    }

    const deleteEdge = () => {
        deleteSelectedEdge(edge.id);
        setStatus(false);
    }

    useEffect(() => {
        setStatus(selectedStatus);
        setEdge(selectedEdge);
    }, [selectedEdge]);

    return (
        <div className="space-y-10">
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="edgePath">
                    <AccordionTrigger>Edge Path</AccordionTrigger>
                    <AccordionContent>
                        <div className="flex justify-center align-center">
                            <Input id="source-In" placeholder={edge.source} onChange={handleSourceChange} />
                            <p className="positionY-1/2">-</p>
                            <Input id="target-In" placeholder={edge.target} onChange={handleTargetChange} />
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="edgeAnimated">
                    <AccordionTrigger>Animation</AccordionTrigger>
                    <AccordionContent>
                        <Checkbox id="edgeAnimatedCheck" checked={animated} onCheckedChange={(change) => handleAnimationChange(change as boolean)} />
                        <Label>  Animated?</Label>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <Button variant="destructive" className="w-full" onClick={deleteEdge}>Delete Edge</Button>
        </div>
    )
}

export default EdgePropertiesPane;