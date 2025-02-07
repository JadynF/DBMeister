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
import { X } from 'lucide-react';
import SQLTableNode from '../(xyflow)/sqlTable';

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
};
type SQLTableType = {
    id: string,
    type: string,
    header: string,
    tableData: SQLTableDataType[] //Array of type Record<string, __valueType__>
};

type ExcelField = {
    fieldName: string,
    fieldFormat: string,
    fieldDataType: string,
    fieldDataValidation: string | null,
    fieldSort: string | null,
    fieldComments: string | null
}

type ExcelSheet = {
    sheetName: string,
    sheetData: ExcelField[]
}

type ExcelTableType = {
    id: string,
    type: string,
    header: string,
    tableData: ExcelSheet[]
}
//Default New Field when appending to a SQLTableType Node
const defaultSQLField: SQLTableDataType = {fieldName: "New Field", fieldType: 'VARCHAR(55)', nullability: false, keyType: null, unique: false, check: null, indexing: null, comments: ''}

//Function props definitions
type PropertiesPaneProps = {
    selectedNode: Node<TestData | SQLTableType>;
    setSelectedNodePosition: (position: Position) => void;
    setSelectedNodeData: (nodeData: TestData | SQLTableType | ExcelTableType) => void;
    deleteSelectedNode: (selectedNodeID: string) => void;
};

const PropertiesPane: React.FC<PropertiesPaneProps> = ({selectedNode, setSelectedNodePosition, setSelectedNodeData, deleteSelectedNode}) => {
    const [nodePosition, setPosition] = useState<Position>(selectedNode.position);
    const [nodeData, setNodeData] = useState<TestData | SQLTableType | ExcelTableType>(selectedNode.data);
    //const [nodeStyle, setNodeStyle] = useState(selectedNode.style); //To be done later

    const [nodeHeader, setNodeHeader] = useState('');

    //SQL Table Type TableData variable objects
    const [fieldNames, setFieldNames] = useState<Record<string, string>>({});
    const [fieldTypes, setFieldTypes] = useState<Record<string, string>>({});
    const [nullabilities, setNullabilities] = useState<Record<string, boolean>>({});
    const [keyTypes, setKeyTypes] = useState<Record<string, string | null>>({});
    const [uniques, setUniques] = useState<Record<string, boolean>>({});
    const [checks, setChecks] = useState<Record<string, string | null>>({});
    const [indexes, setIndexes] = useState<Record<string, string | null>>({});
    const [comments, setComments] = useState<Record<string, string | null>>({});

    //Node Position Manipulation
    //Might want to replace these with useState variables and follow the style of SQL TableData variable objects?
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

    //Node Header (Name) Manipulation
    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNodeHeader(event.target.value);
    }
    const updateHeader = () => {
        console.log('updateHeader called!');
        console.log("isTestType? ", isTestType(nodeData));
        if(isSQLTableType(nodeData)){
            const newNodeData: SQLTableType = {
                id: nodeData.id,
                type: nodeData.type,
                header: nodeHeader,
                tableData: nodeData.tableData
            };
            setNodeData(newNodeData);
            setSelectedNodeData(newNodeData);
        }
        if(isExcelTableType(nodeData)) {
            console.log("isTestType? ", isExcelTableType(nodeData));
            const newNodeData: ExcelTableType = {
                id: nodeData.id,
                type: nodeData.type,
                header: nodeHeader,
                tableData: nodeData.tableData
            };
            setNodeData(newNodeData);
            setSelectedNodeData(newNodeData);
        }
        if(isTestType(nodeData)) {
            console.log("isTestType? ", isTestType(nodeData));
            const newNodeData: TestData = {
                label: nodeHeader,
                color: nodeData.color
            };
            setNodeData(newNodeData);
            setSelectedNodeData(newNodeData);
        }
    }

    const deleteNode = () => {
        deleteSelectedNode(selectedNode.id);
    }

    //SQLTableType Node - Data Manipulation
    //SQLTableType Change Trackers
    const handleFieldNameChange = (keyname: string, event: React.ChangeEvent<HTMLInputElement>) => { setFieldNames((prevNames) => ({...prevNames, [keyname]: event.target.value})); }
    const handleFieldTypeChange = (keyname: string, event: React.ChangeEvent<HTMLInputElement>) => { setFieldTypes((prevTypes) => ({...prevTypes, [keyname]: event.target.value})); }
    const handleNullChange = (keyname: string, change: boolean) => {setNullabilities((prevNulls) => ({...prevNulls, [keyname]: change})); }
    const handleKeyTypeChange = (keyname: string, event: React.ChangeEvent<HTMLInputElement>) => { setKeyTypes((prevKeyTypes) => ({...prevKeyTypes, [keyname]: event.target.value})); }
    const handleUniqueChange = (keyname: string, change: boolean) => { setUniques((prevUniques) => ({...prevUniques, [keyname]: change})); }
    const handleCheckChange = (keyname: string, event: React.ChangeEvent<HTMLInputElement>) => { setChecks((prevChecks) => ({...prevChecks, [keyname]: event.target.value})); }
    const handleIndexChange = (keyname: string, event: React.ChangeEvent<HTMLInputElement>) => { setIndexes((prevIndexes) => ({...prevIndexes, [keyname]: event.target.value})); }
    const handleCommentChange = (keyname: string, event: React.ChangeEvent<HTMLTextAreaElement>) => { setComments((prevComments) => ({...prevComments, [keyname]: event.target.value})); }

    //SQLTableType enact change functions
    const addField = (nodeData: SQLTableType) => {
        let newData = nodeData;
        let newTuple = structuredClone(defaultSQLField); //Deep Copy, not reference
        newTuple.fieldName = `${defaultSQLField.fieldName}-${newData.tableData.length + 1}`;
        newData.tableData.push(newTuple);
        let keyname = `${newTuple.fieldName}`;
        //You have to set each of the SQL Table Type useState variables to include the new tuple fields because it won't auto-update. So stupid.
        setFieldNames((prevNames) => ({...prevNames, [keyname]: keyname}));
        setFieldTypes((prevTypes) => ({...prevTypes, [keyname]: defaultSQLField.fieldType}));
        setNullabilities((prevNulls) => ({...prevNulls, [keyname]: defaultSQLField.nullability}));
        setKeyTypes((prevKeyTypes) => ({...prevKeyTypes, [keyname]: defaultSQLField.keyType}));
        setUniques((prevUniques) => ({...prevUniques, [keyname]: defaultSQLField.unique}));
        setChecks((prevChecks) => ({...prevChecks, [keyname]: defaultSQLField.check}));
        setIndexes((prevIndexes) => ({...prevIndexes, [keyname]: defaultSQLField.indexing}));
        setComments((prevComments) => ({...prevComments, [keyname]: defaultSQLField.comments}));

        setSelectedNodeData(newData);
        setNodeData(newData);
    }

    const deleteField = (nodeData: SQLTableType, deleteFieldName: string) => {
        let newTableData = nodeData.tableData.filter(field => field.fieldName !== deleteFieldName);
        let newData = {id: nodeData.id, type: nodeData.type, header: nodeData.header, tableData: newTableData}
        setNodeData(newData);
        setSelectedNodeData(newData);
    }
    //Create a new set of nodeData from all SQL Table Type useState variables and update the node
    const updateData = (nodeData: TestData | SQLTableType) => {
        if(isSQLTableType(nodeData)){
            const newNodeData: SQLTableType = {
                id: nodeData.id,
                type: nodeData.type,
                header: nodeData.header,
                tableData: []
            };
            //for each field name in fieldNames, find the value of all elements using the field name as the key
            for(const key in fieldNames) {
                let tuple = {
                    fieldName: fieldNames[key],
                    fieldType: fieldTypes[key],
                    nullability: nullabilities[key],
                    keyType: keyTypes[key],
                    unique: uniques[key],
                    check: checks[key],
                    indexing: indexes[key],
                    comments: comments[key]
                };
                newNodeData.tableData.push(tuple); //appends field to the Record object
            }
            setNodeData(newNodeData);
            setSelectedNodeData(newNodeData);
        } else {
            const newNodeData: TestData = {
                label: nodeData.label,
                color: nodeData.color
            }
            setNodeData(newNodeData);
            setSelectedNodeData(newNodeData);
        }
    }


    //HELPER FUNCTIONS

    //Checks type of nodeData to determine data options in html
    const isExcelTableType = (data: any): data is ExcelTableType => { return (data as ExcelTableType).type === "excel"; }
    const isSQLTableType = (data: any): data is SQLTableType => { return (data as SQLTableType).type === "sql"; }
    const isTestType = (data: any): data is TestData => { return (data as TestData).color !== undefined; }
    //Functions to handle non-string values in html
    const printBool = (bool: boolean) => { if(bool) { return 'true';} else {return 'false';} }
    const strToBool = (str: string) => { if(str=="true") { return true;} else {return false;} }
    const printStrOption = (strOption: string | null) => { if(strOption) {return strOption;} else {return '';} }

    // Update local state whenever selectedNode changes
    useEffect(() => {
        setPosition(selectedNode.position);
        setNodeData(selectedNode.data);
    }, [selectedNode]); // Re-runs whenever selectedNode changes

    //Set Node Name. Instantiate SQL Table Type tableData variables to track user's changes to data.
    //Keys in each variable are the fieldName, values are the corresponding values to the field
    useEffect(() => {
        if(isSQLTableType(nodeData)) {
            setNodeHeader(nodeData.header);
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
        if(isTestType(nodeData)) {
            setNodeHeader(nodeData.label);
        }
    }, [nodeData]); //Re-runs when nodeData changes (only after user submits changes to the parent page)

    return (
        <div>
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="tableHeader">
                <AccordionTrigger>Node Name</AccordionTrigger>
                <AccordionContent>
                    {(isSQLTableType(nodeData) || isExcelTableType(nodeData)) && (
                    <div>
                        <Input id="tableHeader-In" placeholder={nodeData.header} onChange={handleNameChange} />
                        <Button onClick={updateHeader}>Update Node Name</Button>
                    </div>
                    )}
                    {isTestType(nodeData) && (
                    <div>
                        <Input id="tableHeader-In" placeholder={nodeData.label} onChange={handleNameChange} />
                        <Button onClick={updateHeader}>Update Node Name</Button>
                    </div>
                    )}
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="nodePosition">
                <AccordionTrigger>Position</AccordionTrigger>
                <AccordionContent>
                    <Label htmlFor="positionY">X position</Label>
                    <Input id="positionX-In" ref={positionXRef} placeholder={nodePosition.x as unknown as string} onChange={handlePositionXChange} />
                    <Label htmlFor="positionX">Y position</Label>
                    <Input id="positionY-In" ref={positionYRef} placeholder={nodePosition.y as unknown as string} onChange={handlePositionYChange} />
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
                                    <Accordion type="single" collapsible className="w-full">
                                        <AccordionItem value={`nodeData-${field.fieldName}`}>
                                            <div className="flex items-center justify-between w-full">
                                                <AccordionTrigger className="flex">
                                                    {field.fieldName}
                                                </AccordionTrigger>
                                                <Button variant="destructive" className="flex justify-end" onClick={() => deleteField(nodeData, field.fieldName)}>
                                                    <X />
                                                </Button>
                                            </div>
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
                            <Button onClick={() => addField(nodeData)}> Add New Field</Button>
                            <Button onClick={() => updateData(nodeData)}>Update Table</Button>
                        </ul>
                    </div>
                )}
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="nodeData" className={isExcelTableType(nodeData) ? "block" : "hidden"}>
                <AccordionTrigger>Excel Table Data</AccordionTrigger>
                <AccordionContent>
                    {/*Excel Table Data Accordian */}
                    {isExcelTableType(nodeData) && (
                        <div>
                            <ul>
                                {nodeData.tableData.map((sheet, index) => (
                                    <li key={index}>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem value={`nodeData-${sheet.sheetName}`}>
                                                <AccordionTrigger className="flex">{sheet.sheetName}</AccordionTrigger>
                                                <AccordionContent className="space-y-5">
                                                {sheet.sheetData.map((field, indexS) => (
                                                    <li key={indexS}>
                                                        <Accordion type="single" collapsible className="w-4/5 ml-auto">
                                                            <AccordionItem value={`${sheet.sheetName}-${field.fieldName}`}>
                                                                <AccordionTrigger className="flex">{field.fieldName}</AccordionTrigger>
                                                                <AccordionContent className="space-y-5">
                                                                    <div>
                                                                        <Label htmlFor="fieldName">Field Name</Label>
                                                                        <Input id={field.fieldName} placeholder={field.fieldName} />
                                                                    </div>
                                                                    <div>
                                                                        <Label htmlFor="fieldFormat">Field Format</Label>
                                                                        <Input id={field.fieldFormat} placeholder={field.fieldFormat} />
                                                                    </div>
                                                                    <div>
                                                                        <Label htmlFor="fieldDataType">Field Data Type</Label>
                                                                        <Input id={field.fieldDataType} placeholder={field.fieldDataType} />
                                                                    </div>
                                                                    <div>
                                                                        <Label htmlFor="fieldDataValidation">Field Validation</Label>
                                                                        <Input id={printStrOption(field.fieldDataValidation)} placeholder={printStrOption(field.fieldDataValidation)} />
                                                                    </div>
                                                                    <div>
                                                                        <Label htmlFor="fieldSort">Field Sort</Label>
                                                                        <Input id={printStrOption(field.fieldSort)} placeholder={printStrOption(field.fieldSort)} />
                                                                    </div>
                                                                    <div>
                                                                        <Label htmlFor="fieldComments">Field Comments</Label>
                                                                        <Input id={printStrOption(field.fieldComments)} placeholder={printStrOption(field.fieldComments)} />
                                                                    </div>
                                                                </AccordionContent>
                                                            </AccordionItem>
                                                        </Accordion>
                                                    </li>
                                                ))}
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="nodeStyling">
                <AccordionTrigger>Styling</AccordionTrigger>
                <AccordionContent>
                Yes, you will be able to style a table how you desire. No, we haven't got to it yet.
                </AccordionContent>
            </AccordionItem>
        </Accordion>
        <Button variant="destructive" onClick={deleteNode}>Delete Node</Button>
        </div>
    )
}

export default PropertiesPane;