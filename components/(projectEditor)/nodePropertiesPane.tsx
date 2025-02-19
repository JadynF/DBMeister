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
import { X } from 'lucide-react';

type Position = { x: number; y: number; };

//Node type definitions
type TestData = { header: string; color: string};
type BasicType = {
    id: string,
    type: string,
    header: string,
    data: TestData
};

type IconData = { header: string; image: string};
type IconType = {
    id: string,
    type: string,
    header: string,
    data: IconData
};

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
    fieldType: string,
    check: string | null,
    sort: string | null,
    comments: string | null
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
const defaultSQLField: SQLTableDataType = {fieldName: "New Field", fieldType: 'VARCHAR(55)', nullability: false, keyType: null, unique: false, check: null, indexing: null, comments: ''};
const defaultExcelField: ExcelField = {fieldName: "New Column", fieldType: "Text", check: null, sort: "Ascending", comments: null};
const defaultExcelSheet: ExcelSheet = {sheetName: "New Sheet", sheetData: []};

//Function props definitions
type NodePropertiesPaneProps = {
    selectedNode: Node<BasicType | IconType | SQLTableType | ExcelTableType>;
    selectedStatus: boolean;
    setSelectedNodePosition: (position: Position) => void;
    setSelectedNodeData: (nodeData: BasicType | IconType | SQLTableType | ExcelTableType) => void;
    deleteSelectedNode: (selectedNodeID: string) => void;
};

const NodePropertiesPane: React.FC<NodePropertiesPaneProps> = ({selectedNode, selectedStatus, setSelectedNodePosition, setSelectedNodeData, deleteSelectedNode}) => {
    const [nodePosition, setPosition] = useState<Position>(selectedNode.position);
    const [nodeStatus, setStatus] = useState(selectedStatus);
    const [nodeData, setNodeData] = useState<BasicType | IconType | SQLTableType | ExcelTableType>(selectedNode.data);
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
    //Excel Table Type TableData variable objects
    const [eSheetNames, setESheetNames] = useState<Record<string, string>>({});
    const [eFieldNames, setEFieldNames] = useState<Record<string, string>>({}); //keyname will be a combo of sheetName and fieldName
    const [eFieldTypes, setEFieldTypes] = useState<Record<string, string>>({});
    const [eChecks, setEChecks] = useState<Record<string, string | null>>({});
    const [eSorts, setESorts] = useState<Record<string, string | null>>({});
    const [eComments, setEComments] = useState<Record<string, string | null>>({});

    //Node Position Manipulation
    //Might want to replace these with useState variables and follow the style of SQL TableData variable objects?
    const positionXRef = useRef<HTMLInputElement>(null);
    const positionYRef = useRef<HTMLInputElement>(null);
    const headerRef = useRef<HTMLInputElement>(null);

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
        if (headerRef.current) { headerRef.current.value = ''; }
        if(isSQLTableType(nodeData)){
            const newNodeData: SQLTableType = {
                id: nodeData.id,
                type: nodeData.type,
                header: nodeHeader,
                tableData: nodeData.tableData
            };
            setNodeData(newNodeData);
            setSelectedNodeData(newNodeData);
        } else if(isExcelTableType(nodeData)) {
            const newNodeData: ExcelTableType = {
                id: nodeData.id,
                type: nodeData.type,
                header: nodeHeader,
                tableData: nodeData.tableData
            };
            setNodeData(newNodeData);
            setSelectedNodeData(newNodeData);
        } else if(isIconType(nodeData)) {
            const newNodeData: IconType = {
                id: nodeData.id,
                type: nodeData.type,
                header: nodeHeader,
                data: nodeData.data
            };
            setNodeData(newNodeData);
            setSelectedNodeData(newNodeData);
        } else {
            const newNodeData: BasicType = {
                id: nodeData.id,
                type: nodeData.type,
                header: nodeHeader,
                data: nodeData.data
            };
            setNodeData(newNodeData);
            setSelectedNodeData(newNodeData);
        }
    }

    const deleteNode = () => {
        deleteSelectedNode(selectedNode.id);
        setStatus(false);
    }

    //Table Type Nodes - Data Manipulation
    //SQLTableType Change Trackers
    const handleFieldNameChange = (keyname: string, event: React.ChangeEvent<HTMLInputElement>) => { setFieldNames((prevNames) => ({...prevNames, [keyname]: event.target.value})); }
    const handleFieldTypeChange = (keyname: string, event: React.ChangeEvent<HTMLInputElement>) => { setFieldTypes((prevTypes) => ({...prevTypes, [keyname]: event.target.value})); }
    const handleCheckChange = (keyname: string, event: React.ChangeEvent<HTMLInputElement>) => { setChecks((prevChecks) => ({...prevChecks, [keyname]: event.target.value})); }
    const handleCommentChange = (keyname: string, event: React.ChangeEvent<HTMLTextAreaElement>) => { setComments((prevComments) => ({...prevComments, [keyname]: event.target.value})); }
    const handleNullChange = (keyname: string, change: boolean) => {setNullabilities((prevNulls) => ({...prevNulls, [keyname]: change})); }
    const handleKeyTypeChange = (keyname: string, event: React.ChangeEvent<HTMLInputElement>) => { setKeyTypes((prevKeyTypes) => ({...prevKeyTypes, [keyname]: event.target.value})); }
    const handleUniqueChange = (keyname: string, change: boolean) => { setUniques((prevUniques) => ({...prevUniques, [keyname]: change})); }
    const handleIndexChange = (keyname: string, event: React.ChangeEvent<HTMLInputElement>) => { setIndexes((prevIndexes) => ({...prevIndexes, [keyname]: event.target.value})); }

    //ExcelTableType Sheet Change Trackers
    const handleESheetNameChange = (keyname: string, event: React.ChangeEvent<HTMLInputElement>) => { setESheetNames((prevSheetNames) => ({...prevSheetNames, [keyname]: event.target.value})); }
    //ExcelTableType Field Change Trackers (keynames must be 'sheetName-fieldName' format)
    const handleEFieldNameChange = (keyname: string, event: React.ChangeEvent<HTMLInputElement>) => { setEFieldNames((prevENames) => ({...prevENames, [keyname]: event.target.value})); }
    const handleEFieldTypeChange = (keyname: string, event: React.ChangeEvent<HTMLInputElement>) => { setEFieldTypes((prevETypes) => ({...prevETypes, [keyname]: event.target.value})); }
    const handleECheckChange = (keyname: string, event: React.ChangeEvent<HTMLInputElement>) => { setEChecks((prevEChecks) => ({...prevEChecks, [keyname]: event.target.value})); }
    const handleECommentChange = (keyname: string, event: React.ChangeEvent<HTMLTextAreaElement>) => { setEComments((prevEComments) => ({...prevEComments, [keyname]: event.target.value})); }
    const handleESortChange = (keyname: string, event: React.ChangeEvent<HTMLInputElement>) => { setESorts((prevESorts) => ({...prevESorts, [keyname]: event.target.value})); }

    //SQLTableType enact change functions
    const addField = (nodeData: SQLTableType) => {
        let newData = nodeData;
        let newField = structuredClone(defaultSQLField); //Deep Copy, not reference
        newField.fieldName = `${defaultSQLField.fieldName}-${newData.tableData.length + 1}`;
        //Used to ensure user cannot make two fields with the same keyname
        while(newData.tableData.some(field => field.fieldName === newField.fieldName)){
            let counter = 1;
            newField.fieldName = `${newField.fieldName}-${counter}`;
            counter++;
        }
        newData.tableData.push(newField);
        let keyname = `${newField.fieldName}`;
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

    const addESheet = (nodeData: ExcelTableType) => {
        let newData = nodeData;
        let newSheet = structuredClone(defaultExcelSheet);
        newSheet.sheetName = `${defaultExcelSheet.sheetName}-${newData.tableData.length + 1}`;
        //Used to ensure user cannot make two sheets with the same keyname
        while(newData.tableData.some(sheet => sheet.sheetName === newSheet.sheetName)){
            let counter = 1;
            newSheet.sheetName = `${newSheet.sheetName}-${counter}`;
            counter++;
        }
        newData.tableData.push(newSheet);

        let keyname = newSheet.sheetName;
        setESheetNames((prevNames) => ({...prevNames, [keyname]: keyname}));

        setSelectedNodeData(newData);
        setNodeData(newData);
    }

    const addEField = (nodeData: ExcelTableType, currSheet: ExcelSheet) => {
        let newData = nodeData;
        let currSheetName = currSheet.sheetName;
        const index = newData.tableData.indexOf(currSheet);

        let newField = structuredClone(defaultExcelField);
        newField.fieldName = `${defaultExcelField.fieldName}-${currSheet.sheetData.length + 1}`;
        let counter = 1;
        while(newData.tableData[index].sheetData.some(field => field.fieldName === newField.fieldName)){
            newField.fieldName = `${newField.fieldName}-${counter}`;
            counter++;
        }
        newData.tableData[index].sheetData.push(newField); //In newData, find the current sheet and append the newField to it

        let keyname = `${currSheetName}-${newField.fieldName}`;
        setEFieldNames((prevNames) => ({ ...prevNames, [keyname]: newField.fieldName})); //Need to append to records for each sheet
        setEFieldTypes((prevTypes) => ({...prevTypes, [keyname]: defaultExcelField.fieldType}));
        setEChecks((prevChecks) => ({...prevChecks, [keyname]: defaultExcelField.check}));
        setESorts((prevSorts) => ({...prevSorts, [keyname]: defaultExcelField.sort}));
        setEComments((prevComments) => ({...prevComments, [keyname]: defaultExcelField.comments}));

        setSelectedNodeData(newData);
        setNodeData(newData);
    }

    /* Used to see current state of excel table data
    const printEData = () => {
        console.log(eSheetNames);
        console.log("Sheet Data :");
        console.log(eSheetData);
        console.log(": End Of Sheet Data");
        console.log(eFieldNames);
        console.log(eFieldTypes);
        console.log(eChecks);
        console.log(eSorts);
        console.log(eComments);
    }
    */

    const deleteField = (nodeData: SQLTableType, deleteFieldName: string) => {
        let newTableData = nodeData.tableData.filter(field => field.fieldName !== deleteFieldName);
        let newData = {id: nodeData.id, type: nodeData.type, header: nodeData.header, tableData: newTableData}
        setNodeData(newData);
        setSelectedNodeData(newData);
    }

    const deleteESheet = (nodeData: ExcelTableType, deleteSheetName: string) => {
        let newTableData = nodeData.tableData.filter(sheet => sheet.sheetName !== deleteSheetName);
        let newData = {id: nodeData.id, type: nodeData.type, header: nodeData.header, tableData: newTableData};
        setNodeData(newData);
        setSelectedNodeData(newData);
    }

    const deleteEField = (nodeData: ExcelTableType, currSheet: ExcelSheet, delFieldName: string) => {
        const index = nodeData.tableData.indexOf(currSheet);
        let newSheetData = nodeData.tableData[index].sheetData.filter(field => field.fieldName !== delFieldName);
        let newTableData = nodeData.tableData.map(sheet =>
            sheet === currSheet ? {...sheet, sheetData: newSheetData} : sheet
        );
        let newData = {...nodeData, tableData: newTableData};
        setNodeData(newData);
        setSelectedNodeData(newData);
    }

    //Create a new set of nodeData from all SQL Table Type useState variables and update the node
    const updateData = (nodeData: BasicType | IconType | SQLTableType | ExcelTableType) => {
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
        } else if (isExcelTableType(nodeData)){
            //All of nodeData. Contains entirety of the table.
            const newNodeData: ExcelTableType = {
                id: nodeData.id,
                type: nodeData.type,
                header: nodeData.header,
                tableData: []
            };
            //Loop through each sheet in the table
            for(const sKey in eSheetNames) {
                //A sheet. Contains every field within the sheet.
                let newSheetData: ExcelSheet = {
                    sheetName: eSheetNames[sKey],
                    sheetData: []
                }
                //Loop through every field
                for(const fKey in eFieldNames){
                    //If the field key belong to the current sheet, create the field and push it to the sheet's data
                    if(fKey.includes(sKey)){
                        let tuple = {
                            fieldName: eFieldNames[fKey],
                            fieldType: eFieldTypes[fKey],
                            check: eChecks[fKey],
                            sort: eSorts[fKey],
                            comments: eComments[fKey]
                        }
                        newSheetData.sheetData.push(tuple);
                    }
                }
                newNodeData.tableData.push(newSheetData);
            }
            setNodeData(newNodeData);
            setSelectedNodeData(newNodeData);
        } else if(isIconType(nodeData)) {
            const newNodeData: IconType = {
                id: nodeData.id,
                type: nodeData.type,
                header: nodeData.header,
                data: nodeData.data
            }
            setNodeData(newNodeData);
            setSelectedNodeData(newNodeData);
        } else {
            const newNodeData: BasicType = {
                id: nodeData.id,
                type: nodeData.type,
                header: nodeData.header,
                data: nodeData.data
            }
            setNodeData(newNodeData);
            setSelectedNodeData(newNodeData);
        }
    }


    //HELPER FUNCTIONS

    //Checks type of nodeData to determine data options in html
    const isExcelTableType = (data: any): data is ExcelTableType => { return (data as ExcelTableType).type === "excel"; }
    const isSQLTableType = (data: any): data is SQLTableType => { return (data as SQLTableType).type === "sql"; }
    const isIconType = (data: any): data is IconType => { return (data as IconType).type === "icon"; }
    const isBasicType = (data: any): data is BasicType => { return (data as BasicType).type === "basic"; }
    //Functions to handle non-string values in html
    const printBool = (bool: boolean) => { if(bool) { return 'true';} else {return 'false';} }
    const printStrOption = (strOption: string | null) => { if(strOption) {return strOption;} else {return '';} }

    // Update local state whenever selectedNode changes
    useEffect(() => {
        setPosition(selectedNode.position);
        setNodeData(selectedNode.data);
        setStatus(selectedStatus);
    }, [selectedNode]); // Re-runs whenever selectedNode changes

    //Set Node Name. Instantiate tableData variables to track user's changes to data.
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
        } else if (isExcelTableType(nodeData)) {
            setESheetNames({}); //Because the accumulators append to account for looping, must first clear
            setEFieldNames({});
            setEFieldTypes({});
            setEChecks({});
            setESorts({});
            setEComments({});
            setNodeHeader(nodeData.header);
            const { iSheetNames, iSheetData } = nodeData.tableData.reduce((acc, sheet) => {
                acc.iSheetNames[sheet.sheetName] = sheet.sheetName;
                acc.iSheetData[sheet.sheetName] = sheet.sheetData;
                const { iFieldNames, iFieldTypes, iChecks, iSorts, iComments } = sheet.sheetData.reduce((scc, field) => {
                    scc.iFieldNames[`${sheet.sheetName}-${field.fieldName}`] = field.fieldName;
                    scc.iFieldTypes[`${sheet.sheetName}-${field.fieldName}`] = field.fieldType;
                    scc.iChecks[`${sheet.sheetName}-${field.fieldName}`] = field.check;
                    scc.iSorts[`${sheet.sheetName}-${field.fieldName}`] = field.sort;
                    scc.iComments[`${sheet.sheetName}-${field.fieldName}`] = field.comments;
                    return scc;
                },
                {
                    iFieldNames: {} as Record<string, string>,
                    iFieldTypes: {} as Record<string, string>,
                    iChecks: {} as Record<string, string | null>,
                    iSorts: {} as Record<string, string | null>,
                    iComments: {} as Record<string, string | null>,
                });
                setEFieldNames((prevNames) => ({ ...prevNames, ...iFieldNames })); //Need to append to records for each sheet
                setEFieldTypes((prevTypes) => ({...prevTypes, ...iFieldTypes}));
                setEChecks((prevChecks) => ({...prevChecks, ...iChecks}));
                setESorts((prevSorts) => ({...prevSorts, ...iSorts}));
                setEComments((prevComments) => ({...prevComments, ...iComments}));
                return acc;
            },
            {
                iSheetNames: {} as Record<string, string>,
                iSheetData: {} as Record<string, ExcelField[]>
            });
            setESheetNames(iSheetNames);
        } else {
            setNodeHeader(nodeData.header);
        }
    }, [nodeData]); //Re-runs when nodeData changes (only after user submits changes to the parent page)

    if(nodeStatus) {
        return (
            <div className="space-y-10">
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="tableHeader">
                    <AccordionTrigger>Node Name</AccordionTrigger>
                    <AccordionContent>
                        <div>
                            <Input id="tableHeader-In" ref={headerRef} placeholder={nodeData.header} onChange={handleNameChange} />
                            <Button onClick={updateHeader}>Update Node Name</Button>
                        </div>
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
                                <Button className=" w-1/2 bg-green-600" onClick={() => addField(nodeData)}> Add New Field</Button>
                                <Button className="w-1/2" onClick={() => updateData(nodeData)}>Update Table</Button>
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
                                                    <div className="flex items-center justify-between w-full">
                                                    <AccordionTrigger className="flex">{sheet.sheetName}</AccordionTrigger>
                                                    <Button variant="destructive" className="flex justify-end" onClick={() => deleteESheet(nodeData, sheet.sheetName)}>
                                                        <X />
                                                    </Button>
                                                    </div>
                                                    <AccordionContent className="space-y-5">
                                                        <div>
                                                            <Label htmlFor="sheetName">Sheet Name</Label>
                                                            <Input id={sheet.sheetName} placeholder={sheet.sheetName} onChange={(event) => handleESheetNameChange(sheet.sheetName, event)} />
                                                        </div>
                                                        <ul>
                                                        {sheet.sheetData.map((field, indexS) => (
                                                            <li key={indexS}>
                                                                <Accordion type="single" collapsible className="w-4/5 ml-auto">
                                                                    <AccordionItem value={`${sheet.sheetName}-${field.fieldName}`}>
                                                                        <div className="flex items-center justify-between w-full">
                                                                        <AccordionTrigger className="flex">{field.fieldName}</AccordionTrigger>
                                                                        <Button variant="destructive" className="flex justify-end" onClick={() => deleteEField(nodeData, sheet, field.fieldName)}>
                                                                            <X />
                                                                        </Button>
                                                                        </div>
                                                                        <AccordionContent className="space-y-5">
                                                                            <div>
                                                                                <Label htmlFor="efieldName">Field Name</Label>
                                                                                <Input id={field.fieldName} placeholder={field.fieldName} onChange={(event) => handleEFieldNameChange(`${sheet.sheetName}-${field.fieldName}`, event)}/>
                                                                            </div>
                                                                            <div>
                                                                                <Label htmlFor="efieldType">Field Format</Label>
                                                                                <Input id={field.fieldType} placeholder={field.fieldType} onChange={(event) => handleEFieldTypeChange(`${sheet.sheetName}-${field.fieldName}`, event)}/>
                                                                            </div>
                                                                            <div>
                                                                                <Label htmlFor="efieldDataValidation">Field Validation</Label>
                                                                                <Input id={printStrOption(field.check)} placeholder={printStrOption(field.check)} onChange={(event) => handleECheckChange(`${sheet.sheetName}-${field.fieldName}`, event)}/>
                                                                            </div>
                                                                            <div>
                                                                                <Label htmlFor="efieldSort">Field Sort</Label>
                                                                                <Input id={printStrOption(field.sort)} placeholder={printStrOption(field.sort)} onChange={(event) => handleESortChange(`${sheet.sheetName}-${field.fieldName}`, event)}/>
                                                                            </div>
                                                                            <div>
                                                                                <Label htmlFor="efieldComments">Field Comments</Label>
                                                                                <Textarea id={printStrOption(field.comments)} placeholder={printStrOption(field.comments)} onChange={(event) => handleECommentChange(`${sheet.sheetName}-${field.fieldName}`, event)}/>
                                                                            </div>
                                                                        </AccordionContent>
                                                                    </AccordionItem>
                                                                </Accordion>
                                                            </li>
                                                        ))}
                                                        </ul>
                                                        <div className="flex justify-end">
                                                            <Button className="w-4/5 bg-green-600" onClick={() => addEField(nodeData, sheet)}>Add New Field</Button>
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        </li>
                                    ))}
                                </ul>
                                <Button className="w-1/2 bg-green-600" onClick={() => addESheet(nodeData)}>Add Sheet</Button>
                                <Button className="w-1/2 " onClick={() => updateData(nodeData)}>Update Data</Button>
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
            <Button variant="destructive" className="w-full" onClick={deleteNode}>Delete Node</Button>
            </div>
        )
    } else {
        return (
            <Label>Select a node to see its properties.</Label>
        )
    }
}

export default NodePropertiesPane;