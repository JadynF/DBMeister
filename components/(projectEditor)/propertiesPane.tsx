'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
    type Node,
    type Edge,
    type FitViewOptions,
    type OnConnect,
    type OnNodesChange,
    type OnEdgesChange,
    type OnNodeDrag,
    type NodeTypes,
    type EdgeTypes,
    type DefaultEdgeOptions
} from '@xyflow/react';

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

type Position = { x: number; y: number; };

//Node type definitions
type TestData = { label: string; color: string; };
type SQLTableDataType = {
    fieldName: string,
    fieldType: string,
    nullability: boolean,
    keyType: string | null,
    unique: boolean,
    check: string | null,
    indexing: string | null,
    comments: string | null
}
type SQLTableType = {
    id: string,
    header: string,
    tableData: SQLTableDataType[] //Array of type Record<string, __valueType__>
}
//Function props definitions
type PropertiesPaneProps = {
    setSelectedNodePosition: (position: Position) => void;
    setSelectedNodeData: (nodeData: SQLTableType) => void;
    selectedNode: Node<TestData | SQLTableType>
};

const PropertiesPane: React.FC<PropertiesPaneProps> = ({setSelectedNodePosition, setSelectedNodeData, selectedNode}) => {
    const [nodePosition, setPosition] = useState<Position>(selectedNode.position);
    const [nodeData, setNodeData] = useState<TestData | SQLTableType>(selectedNode.data);
    const [nodeStyle, setNodeStyle] = useState(selectedNode.style);

    //SQL Table Type TableData variable objects
    const [fieldNames, setFieldNames] = useState<Record<string, string>>({});
    const [fieldTypes, setFieldTypes] = useState<Record<string, string>>({});
    const [nullabilities, setNullabilities] = useState<Record<string, boolean>>({});
    const [keyTypes, setKeyTypes] = useState<Record<string, string | null>>({});
    const [uniques, setUniques] = useState<Record<string, boolean>>({});
    const [checks, setChecks] = useState<Record<string, string | null>>({});
    const [indexes, setIndexes] = useState<Record<string, string | null>>({});
    const [comments, setComments] = useState<Record<string, string | null>>({});

    //Position Input references. Might want to replace these with useState variables and follow the style of SQL TableData variable objects?
    const positionXRef = useRef<HTMLInputElement>(null);
    const positionYRef = useRef<HTMLInputElement>(null);

    //Updating position functions (internal selectedNode)
    const handlePositionXChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let newPosition: Position = {x: event.target.value as unknown as number, y: nodePosition.y};
        setPosition(newPosition);
    }
    const handlePositionYChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let newPosition: Position = {x: nodePosition.x, y: event.target.value as unknown as number};
        setPosition(newPosition);
    }
    //Reset inputs, send selectedNode position to page
    const updatePosition = (nodePosition: Position) => {
        //Clear the position inputs after submitting a new position
        if (positionXRef.current) { positionXRef.current.value = ''; }
        if (positionYRef.current) { positionYRef.current.value = ''; }

        setSelectedNodePosition(nodePosition);   
    }

    //SQL Table Type Change Trackers
    const handleFieldNameChange = (keyname: string, event: React.ChangeEvent<HTMLInputElement>) => { setFieldNames((prevNames) => ({...prevNames, [keyname]: event.target.value})); }
    const handleFieldTypeChange = (keyname: string, event: React.ChangeEvent<HTMLInputElement>) => { setFieldTypes((prevTypes) => ({...prevTypes, [keyname]: event.target.value})); }
    const handleNullChange = (keyname: string, change: boolean) => {setNullabilities((prevNulls) => ({...prevNulls, [keyname]: change})); }
    const handleKeyTypeChange = (keyname: string, event: React.ChangeEvent<HTMLInputElement>) => { setKeyTypes((prevKeyTypes) => ({...prevKeyTypes, [keyname]: event.target.value})); }
    const handleUniqueChange = (keyname: string, change: boolean) => { setUniques((prevUniques) => ({...prevUniques, [keyname]: change})); }
    const handleCheckChange = (keyname: string, event: React.ChangeEvent<HTMLInputElement>) => { setChecks((prevChecks) => ({...prevChecks, [keyname]: event.target.value})); }
    const handleIndexChange = (keyname: string, event: React.ChangeEvent<HTMLInputElement>) => { setIndexes((prevIndexes) => ({...prevIndexes, [keyname]: event.target.value})); }
    const handleCommentChange = (keyname: string, event: React.ChangeEvent<HTMLTextAreaElement>) => { setComments((prevComments) => ({...prevComments, [keyname]: event.target.value})); }

    //Create a new set of nodeData from all SQL Table Type useState variables
    const updateData = (nodeData: SQLTableType) => {
        const newNodeData: SQLTableType = {
            id: nodeData.id,
            header: nodeData.header,
            tableData: []
        };
        //for each field name in fieldNames, find the value of all elements using the field name as the key
        for(const key in fieldNames) {
            let field = {
                fieldName: fieldNames[key],
                fieldType: fieldTypes[key],
                nullability: nullabilities[key],
                keyType: keyTypes[key],
                unique: uniques[key],
                check: checks[key],
                indexing: indexes[key],
                comments: comments[key]
            };
            newNodeData.tableData.push(field); //appends field to the Record object
        }
        setNodeData(newNodeData);
        setSelectedNodeData(newNodeData);
    }

    //Checks type of nodeData to determine data options in html
    const isSQLTableType = (data: any): data is SQLTableType => { return (data as SQLTableType).tableData !== undefined; }

    //Functions to handle non-string values in html
    const printBool = (bool: boolean) => { if(bool) { return 'true';} else {return 'false';} }
    const strToBool = (str: string) => { if(str=="true") { return true;} else {return false;} }
    const printStrOption = (strOption: string | null) => { if(strOption) {return strOption;} else {return '';} }

    // Update local state whenever selectedNode changes
    useEffect(() => {
        setPosition(selectedNode.position);
        setNodeData(selectedNode.data);
    }, [selectedNode]); // Re-runs whenever selectedNode changes

    //Instantiate SQL Table Type tableData variables to track user's changes to data.
    //Keys in each variable are the fieldName, values are the corresponding values to the field
    useEffect(() => {
        if(isSQLTableType(nodeData)) {
        const { initialNames, initialTypes, iNulls, iKeys, iUniques, iChecks, iIndexes, iComments } = nodeData.tableData.reduce((acc, field) => {
            acc.initialNames[field.fieldName] = field.fieldName;
            acc.initialTypes[field.fieldName] = field.fieldType;
            acc.iNulls[field.fieldName] = field.nullability;
            acc.iKeys[field.fieldName] = field.keyType;
            acc.iUniques[field.fieldName] = field.unique;
            acc.iChecks[field.fieldName] = field.check;
            acc.iIndexes[field.fieldName] = field.indexing;
            acc.iComments[field.fieldName] = field.comments;
            return acc
        }, 
        {
            initialNames: {} as Record<string, string>,
            initialTypes: {} as Record<string, string>,
            iNulls: {} as Record<string, boolean>,
            iKeys: {} as Record<string, string | null>,
            iUniques: {} as Record<string, boolean>,
            iChecks: {} as Record<string, string | null>,
            iIndexes: {} as Record<string, string | null>,
            iComments: {} as Record<string, string | null>
        })
        setFieldNames(initialNames);
        setFieldTypes(initialTypes);
        setNullabilities(iNulls);
        setKeyTypes(iKeys);
        setUniques(iUniques);
        setChecks(iChecks);
        setIndexes(iIndexes);
        setComments(iComments);
        }
    }, [nodeData]); //Re-runs when nodeData changes (only after user submits changes to the parent page)

    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="nodePosition">
                <AccordionTrigger>Position</AccordionTrigger>
                <AccordionContent>
                    <Label htmlFor='positionY'>X position</Label>
                    <Input id='positionX-In' ref={positionXRef} placeholder={nodePosition.x as unknown as string} onChange={handlePositionXChange} />
                    <Label htmlFor='positionX'>Y position</Label>
                    <Input id='positionY-In' ref={positionYRef} placeholder={nodePosition.y as unknown as string} onChange={handlePositionYChange} />
                    <Button onClick={() => updatePosition(nodePosition)}>Set Position</Button>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="nodeData" className={isSQLTableType(nodeData) ? "block" : "hidden"}>
                <AccordionTrigger>SQL Table Data</AccordionTrigger>
                <AccordionContent>
                {/*SQL Table Data Accordian */}
                {isSQLTableType(nodeData) && (
                    <div>
                        <ul>
                            {nodeData.tableData.map((field, index) => (
                                <li key={index}>
                                    <Accordion type="single" collapsible className="w-5/6 ml-auto">
                                        <AccordionItem value={`nodeData-${field.fieldName}`}>
                                            <AccordionTrigger>{field.fieldName}</AccordionTrigger>
                                            <AccordionContent className='space-y-5'>
                                                <div>
                                                    <Label htmlFor="fieldName">Field Name</Label>
                                                    <Input id={field.fieldName} placeholder={field.fieldName} onChange={(event) => handleFieldNameChange(field.fieldName, event)} />
                                                </div>
                                                <div>
                                                    <Label htmlFor="fieldType">Field Type</Label>
                                                    <Input id={field.fieldType} placeholder={field.fieldType} onChange={(event) => handleFieldTypeChange(field.fieldName, event)} />
                                                </div>
                                                <div>
                                                    <Checkbox id={`null-${printBool(field.nullability)}`} checked={nullabilities[field.fieldName]} onCheckedChange={(change) => handleNullChange(field.fieldName, change as boolean)} />
                                                    <Label htmlFor="nullability">Can Be Null<br></br></Label>
                                                </div>
                                                <div>
                                                    <Checkbox id={`unique-${printBool(field.unique)}`} checked={uniques[field.fieldName]} onCheckedChange={(change) => handleUniqueChange(field.fieldName, change as boolean)} />
                                                    <Label htmlFor="uniques">Is Unique<br></br></Label>
                                                </div>
                                                <div>
                                                    {/*Do I want to put in the effort to make a shadcn combobox for this component? Not really */}
                                                    <Label htmlFor="keyTypes">Key Type</Label>
                                                    <Input id={printStrOption(field.keyType)} placeholder={printStrOption(field.keyType)} onChange={(event) => handleKeyTypeChange(field.fieldName, event)} />
                                                </div>
                                                <div>
                                                    <Label htmlFor="fieldChecks">Field Checks</Label>
                                                    <Input id={printStrOption(field.check)} placeholder={printStrOption(field.check)} onChange={(event) => handleCheckChange(field.fieldName, event)} />
                                                </div>
                                                <div>
                                                    <Label htmlFor="fieldIndexes">Field Indexes</Label>
                                                    <Input id={printStrOption(field.indexing)} placeholder={printStrOption(field.indexing)} onChange={(event) => handleIndexChange(field.fieldName, event)} />
                                                </div>
                                                <div>
                                                    <Label htmlFor="fieldComments">Field Comments</Label>
                                                    <Textarea id={printStrOption(field.comments)} placeholder={printStrOption(field.comments)} onChange={(event) => handleCommentChange(field.fieldName, event)} />
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </li>
                            ))}
                            <Button onClick={() => updateData(nodeData)}>Update Table</Button>
                        </ul>
                    </div>
                )}
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger>Styling</AccordionTrigger>
                <AccordionContent>
                Yes, you will be able to style a table how you desire. No, we haven't got to it yet.
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

export default PropertiesPane;