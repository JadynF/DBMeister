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
type CustomIconType = {
    id: string,
    type: string,
    header: string,
    data: IconData
} //Subset for custom images

type ClassicTableDataType = {
    fieldName: string,
    fieldType: string,
    nullability: boolean,
    keyType: string | null,
    unique: boolean,
    check: string | null,
    indexing: string | null,
    comments: string | null
};
type ClassicTableType = {
    id: string,
    type: string,
    header: string,
    tableData: ClassicTableDataType[] //Array of type Record<string, __valueType__>
};

type NestedField = {
    fieldName: string,
    fieldType: string,
    check: string | null,
    sort: string | null,
    comments: string | null
}
type NestedSheet = {
    sheetName: string,
    sheetData: NestedField[]
}
type NestedTableType = {
    id: string,
    type: string,
    header: string,
    tableData: NestedSheet[]
}

type ShapeData = {header: string, shape: string};
type ShapeType = {
    id: string,
    type: string,
    header: string,
    data: ShapeData
};


//Default New Field when appending to a ClassicTableType Node
const defaultClassicField: ClassicTableDataType = {fieldName: "New Field", fieldType: 'VARCHAR(55)', nullability: false, keyType: null, unique: false, check: null, indexing: null, comments: ''};
const defaultNestedField: NestedField = {fieldName: "New Column", fieldType: "Text", check: null, sort: "Ascending", comments: null};
const defaultNestedSheet: NestedSheet = {sheetName: "New Sheet", sheetData: []};

//Function props definitions
type NodePropertiesPaneProps = {
    projectID: string | undefined;
    selectedNode: Node<BasicType | IconType | ClassicTableType | NestedTableType>;
    selectedStatus: boolean;
    setSelectedNodePosition: (position: Position) => void;
    setSelectedNodeData: (nodeData: BasicType | IconType | ClassicTableType | NestedTableType) => void;
    deleteSelectedNode: (selectedNodeID: string) => void;
};

const NodePropertiesPane: React.FC<NodePropertiesPaneProps> = ({projectID, selectedNode, selectedStatus, setSelectedNodePosition, setSelectedNodeData, deleteSelectedNode}) => {
    const [nodePosition, setPosition] = useState<Position>(selectedNode.position);
    const [nodeStatus, setStatus] = useState(selectedStatus);
    const [nodeData, setNodeData] = useState<BasicType | IconType | ClassicTableType | NestedTableType>(selectedNode.data);
    //const [nodeStyle, setNodeStyle] = useState(selectedNode.style); //To be done later
    const [nodeHeader, setNodeHeader] = useState('');
    const [customImgFile, setcustomImgFile] = useState<File | null>(null);

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
    const [nSheetNames, setNSheetNames] = useState<Record<string, string>>({});
    const [nFieldNames, setNFieldNames] = useState<Record<string, string>>({}); //keyname will be a combo of sheetName and fieldName
    const [nFieldTypes, setNFieldTypes] = useState<Record<string, string>>({});
    const [nChecks, setNChecks] = useState<Record<string, string | null>>({});
    const [nSorts, setNSorts] = useState<Record<string, string | null>>({});
    const [nComments, setNComments] = useState<Record<string, string | null>>({});

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
        if(isClassicTableType(nodeData)){
            const newNodeData: ClassicTableType = {
                id: nodeData.id,
                type: nodeData.type,
                header: nodeHeader,
                tableData: nodeData.tableData
            };
            setNodeData(newNodeData);
            setSelectedNodeData(newNodeData);
        } else if(isNestedTableType(nodeData)) {
            const newNodeData: NestedTableType = {
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

    const deleteNode = async () => {
        deleteSelectedNode(selectedNode.id);
        setStatus(false);
    }

    //Table Type Nodes - Data Manipulation
    //ClassicTableType Change Trackers
    const handleFieldNameChange = (keyname: string, event: React.ChangeEvent<HTMLInputElement>) => { setFieldNames((prevNames) => ({...prevNames, [keyname]: event.target.value})); }
    const handleFieldTypeChange = (keyname: string, event: React.ChangeEvent<HTMLInputElement>) => { setFieldTypes((prevTypes) => ({...prevTypes, [keyname]: event.target.value})); }
    const handleCheckChange = (keyname: string, event: React.ChangeEvent<HTMLInputElement>) => { setChecks((prevChecks) => ({...prevChecks, [keyname]: event.target.value})); }
    const handleCommentChange = (keyname: string, event: React.ChangeEvent<HTMLTextAreaElement>) => { setComments((prevComments) => ({...prevComments, [keyname]: event.target.value})); }
    const handleNullChange = (keyname: string, change: boolean) => {setNullabilities((prevNulls) => ({...prevNulls, [keyname]: change})); }
    const handleKeyTypeChange = (keyname: string, event: React.ChangeEvent<HTMLInputElement>) => { setKeyTypes((prevKeyTypes) => ({...prevKeyTypes, [keyname]: event.target.value})); }
    const handleUniqueChange = (keyname: string, change: boolean) => { setUniques((prevUniques) => ({...prevUniques, [keyname]: change})); }
    const handleIndexChange = (keyname: string, event: React.ChangeEvent<HTMLInputElement>) => { setIndexes((prevIndexes) => ({...prevIndexes, [keyname]: event.target.value})); }

    //NestedTableType Sheet Change Trackers
    const handleNSheetNameChange = (keyname: string, event: React.ChangeEvent<HTMLInputElement>) => { setNSheetNames((prevSheetNames) => ({...prevSheetNames, [keyname]: event.target.value})); }
    //NestedTableType Field Change Trackers (keynames must be 'sheetName-fieldName' format)
    const handleNFieldNameChange = (keyname: string, event: React.ChangeEvent<HTMLInputElement>) => { setNFieldNames((prevENames) => ({...prevENames, [keyname]: event.target.value})); }
    const handleNFieldTypeChange = (keyname: string, event: React.ChangeEvent<HTMLInputElement>) => { setNFieldTypes((prevETypes) => ({...prevETypes, [keyname]: event.target.value})); }
    const handleNCheckChange = (keyname: string, event: React.ChangeEvent<HTMLInputElement>) => { setNChecks((prevNChecks) => ({...prevNChecks, [keyname]: event.target.value})); }
    const handleNCommentChange = (keyname: string, event: React.ChangeEvent<HTMLTextAreaElement>) => { setNComments((prevNComments) => ({...prevNComments, [keyname]: event.target.value})); }
    const handleNSortChange = (keyname: string, event: React.ChangeEvent<HTMLInputElement>) => { setNSorts((prevNSorts) => ({...prevNSorts, [keyname]: event.target.value})); }

    //ClassicTableType enact change functions
    const addField = (nodeData: ClassicTableType) => {
        let newData = nodeData;
        let newField = structuredClone(defaultClassicField); //Deep Copy, not reference
        newField.fieldName = `${defaultClassicField.fieldName}-${newData.tableData.length + 1}`;
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
        setFieldTypes((prevTypes) => ({...prevTypes, [keyname]: defaultClassicField.fieldType}));
        setNullabilities((prevNulls) => ({...prevNulls, [keyname]: defaultClassicField.nullability}));
        setKeyTypes((prevKeyTypes) => ({...prevKeyTypes, [keyname]: defaultClassicField.keyType}));
        setUniques((prevUniques) => ({...prevUniques, [keyname]: defaultClassicField.unique}));
        setChecks((prevChecks) => ({...prevChecks, [keyname]: defaultClassicField.check}));
        setIndexes((prevIndexes) => ({...prevIndexes, [keyname]: defaultClassicField.indexing}));
        setComments((prevComments) => ({...prevComments, [keyname]: defaultClassicField.comments}));

        setSelectedNodeData(newData);
        setNodeData(newData);
    }

    const addNSheet = (nodeData: NestedTableType) => {
        let newData = nodeData;
        let newSheet = structuredClone(defaultNestedSheet);
        newSheet.sheetName = `${defaultNestedSheet.sheetName}-${newData.tableData.length + 1}`;
        //Used to ensure user cannot make two sheets with the same keyname
        while(newData.tableData.some(sheet => sheet.sheetName === newSheet.sheetName)){
            let counter = 1;
            newSheet.sheetName = `${newSheet.sheetName}-${counter}`;
            counter++;
        }
        newData.tableData.push(newSheet);

        let keyname = newSheet.sheetName;
        setNSheetNames((prevNames) => ({...prevNames, [keyname]: keyname}));

        setSelectedNodeData(newData);
        setNodeData(newData);
    }

    const addNField = (nodeData: NestedTableType, currSheet: NestedSheet) => {
        let newData = nodeData;
        let currSheetName = currSheet.sheetName;
        const index = newData.tableData.indexOf(currSheet);

        let newField = structuredClone(defaultNestedField);
        newField.fieldName = `${defaultNestedField.fieldName}-${currSheet.sheetData.length + 1}`;
        let counter = 1;
        while(newData.tableData[index].sheetData.some(field => field.fieldName === newField.fieldName)){
            newField.fieldName = `${newField.fieldName}-${counter}`;
            counter++;
        }
        newData.tableData[index].sheetData.push(newField); //In newData, find the current sheet and append the newField to it

        let keyname = `${currSheetName}-${newField.fieldName}`;
        setNFieldNames((prevNames) => ({ ...prevNames, [keyname]: newField.fieldName})); //Need to append to records for each sheet
        setNFieldTypes((prevTypes) => ({...prevTypes, [keyname]: defaultNestedField.fieldType}));
        setNChecks((prevChecks) => ({...prevChecks, [keyname]: defaultNestedField.check}));
        setNSorts((prevSorts) => ({...prevSorts, [keyname]: defaultNestedField.sort}));
        setNComments((prevComments) => ({...prevComments, [keyname]: defaultNestedField.comments}));

        setSelectedNodeData(newData);
        setNodeData(newData);
    }

    const deleteField = (nodeData: ClassicTableType, deleteFieldName: string) => {
        let newTableData = nodeData.tableData.filter(field => field.fieldName !== deleteFieldName);
        let newData = {id: nodeData.id, type: nodeData.type, header: nodeData.header, tableData: newTableData}
        setNodeData(newData);
        setSelectedNodeData(newData);
    }

    const deleteNSheet = (nodeData: NestedTableType, deleteSheetName: string) => {
        let newTableData = nodeData.tableData.filter(sheet => sheet.sheetName !== deleteSheetName);
        let newData = {id: nodeData.id, type: nodeData.type, header: nodeData.header, tableData: newTableData};
        setNodeData(newData);
        setSelectedNodeData(newData);
    }

    const deleteNField = (nodeData: NestedTableType, currSheet: NestedSheet, delFieldName: string) => {
        const index = nodeData.tableData.indexOf(currSheet);
        let newSheetData = nodeData.tableData[index].sheetData.filter(field => field.fieldName !== delFieldName);
        let newTableData = nodeData.tableData.map(sheet =>
            sheet === currSheet ? {...sheet, sheetData: newSheetData} : sheet
        );
        let newData = {...nodeData, tableData: newTableData};
        setNodeData(newData);
        setSelectedNodeData(newData);
    }

    const browseImg = () => {
        document.getElementById('image-file-upload')?.click();
    };
    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault(); // Allows the file to be dropped
        event.dataTransfer.dropEffect = 'copy'; // Shows "copy" cursor
    };
    const handleImgChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedImg = event.target.files?.[0];
        if(selectedImg){
            setcustomImgFile(selectedImg);
            displayImgName(selectedImg);
        }
    };
    const handleImgDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const img = event.dataTransfer.files[0];
        if (img) {
            setcustomImgFile(img);
            displayImgName(img);
        }
    };
    const displayImgName = (img: any) => {
        document.getElementById('image-name').textContent = `Selected image: ${img.name}`;
    };
    //Calls api route customImageCloud to upload the image locally in /tmp/uploads/ and assigns the url to the nodeData.data.image
    const uploadImageToLocal = async () => {
        if(!customImgFile){
            return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(customImgFile);
        reader.onloadend = async () => {
            const base64File = reader.result;
            const res = await fetch('/api/customImageLocal', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    file: base64File,
                    fileName: customImgFile.name
                }),
            });

            const data = await res.json();
            if (res.ok) {
                if(isCustomIconType(nodeData)){
                    let newData = nodeData;
                    newData.data = {...newData.data, image: data.url};
                    console.log(newData.data);
                    setNodeData(newData);
                    setSelectedNodeData(newData);
                }
                return data.url;
            } else {
                console.error('Upload failed:', data.message);
                return;
            }
        };
    }

    //Create a new set of nodeData from all SQL Table Type useState variables and update the node
    const updateData = (nodeData: BasicType | IconType | ClassicTableType | NestedTableType ) => {
        if(isClassicTableType(nodeData)){
            const newNodeData: ClassicTableType = {
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
        } else if (isNestedTableType(nodeData)){
            //All of nodeData. Contains entirety of the table.
            const newNodeData: NestedTableType = {
                id: nodeData.id,
                type: nodeData.type,
                header: nodeData.header,
                tableData: []
            };
            //Loop through each sheet in the table
            for(const sKey in nSheetNames) {
                //A sheet. Contains every field within the sheet.
                let newSheetData: NestedSheet = {
                    sheetName: nSheetNames[sKey],
                    sheetData: []
                }
                //Loop through every field
                for(const fKey in nFieldNames){
                    //If the field key belong to the current sheet, create the field and push it to the sheet's data
                    if(fKey.includes(sKey)){
                        let tuple = {
                            fieldName: nFieldNames[fKey],
                            fieldType: nFieldTypes[fKey],
                            check: nChecks[fKey],
                            sort: nSorts[fKey],
                            comments: nComments[fKey]
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
    const isNestedTableType = (data: any): data is NestedTableType => { return (data as NestedTableType).type === "excel"; }
    const isClassicTableType = (data: any): data is ClassicTableType => { return (data as ClassicTableType).type === "sql"; }
    const isIconType = (data: any): data is IconType => { return (data as IconType).type === "icon" || (data as IconType).type === "customicon"; }
    const isCustomIconType = (data: any): data is CustomIconType => {return (data as CustomIconType).type === "customicon"; }
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
        if(isClassicTableType(nodeData)) {
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
        } else if (isNestedTableType(nodeData)) {
            setNSheetNames({}); //Because the accumulators append to account for looping, must first clear
            setNFieldNames({});
            setNFieldTypes({});
            setNChecks({});
            setNSorts({});
            setNComments({});
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
                setNFieldNames((prevNames) => ({ ...prevNames, ...iFieldNames })); //Need to append to records for each sheet
                setNFieldTypes((prevTypes) => ({...prevTypes, ...iFieldTypes}));
                setNChecks((prevChecks) => ({...prevChecks, ...iChecks}));
                setNSorts((prevSorts) => ({...prevSorts, ...iSorts}));
                setNComments((prevComments) => ({...prevComments, ...iComments}));
                return acc;
            },
            {
                iSheetNames: {} as Record<string, string>,
                iSheetData: {} as Record<string, NestedField[]>
            });
            setNSheetNames(iSheetNames);
        } else {
            setNodeHeader(nodeData.header);
        }
    }, [nodeData]); //Re-runs when nodeData changes (only after user submits changes to the parent page)

    if(nodeStatus) {
        return (
            <div>
            <div className="flex items-center justify-center w-full">
                Properties
            </div>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="tableHeader">
                    <AccordionTrigger>Node Name</AccordionTrigger>
                    <AccordionContent>
                        <div className="bg-gray-300 dark:bg-gray-900 p-2 rounded-md">
                            <Input id="tableHeader-In" ref={headerRef} placeholder={nodeData.header} onChange={handleNameChange} />
                            <Button onClick={updateHeader} className="mt-4">Update Node Name</Button>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="nodePosition">
                    <AccordionTrigger>Position</AccordionTrigger>
                    <AccordionContent className="bg-gray-300 dark:bg-gray-900 p-2 rounded-md">
                        <Label htmlFor="positionY">X position</Label>
                        <Input className="mt-2 mb-6" id="positionX-In" ref={positionXRef} placeholder={nodePosition.x as unknown as string} onChange={handlePositionXChange} />
                        <Label htmlFor="positionX">Y position</Label>
                        <Input className="mt-2 mb-4" id="positionY-In" ref={positionYRef} placeholder={nodePosition.y as unknown as string} onChange={handlePositionYChange} />
                        <Button onClick={() => updatePosition(nodePosition)}>Set Position</Button>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="nodeData" className={isClassicTableType(nodeData) ? "block" : "hidden"}>
                    <AccordionTrigger>Classic Table Data</AccordionTrigger>
                    <AccordionContent className="bg-gray-300 dark:bg-gray-900 p-2 rounded-md">
                        {/*SQL Table Data Accordian */}
                        {isClassicTableType(nodeData) && (
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
                                                        <Input className="mt-2 mb-6" id={field.fieldName} placeholder={field.fieldName} onChange={(event) => handleFieldNameChange(field.fieldName, event)} />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="fieldType">Field Type</Label>
                                                        <Input className="mt-2 mb-6" id={field.fieldType} placeholder={field.fieldType} onChange={(event) => handleFieldTypeChange(field.fieldName, event)} />
                                                    </div>
                                                    <div className="flex align-center">
                                                        <Checkbox id={`null-${printBool(field.nullability)}`} checked={nullabilities[field.fieldName]} onCheckedChange={(change) => handleNullChange(field.fieldName, change as boolean)} />
                                                        <Label className="ml-2" htmlFor="nullability">Can Be Null<br></br></Label>
                                                    </div>
                                                    <div className="flex align-center">
                                                        <Checkbox id={`unique-${printBool(field.unique)}`} checked={uniques[field.fieldName]} onCheckedChange={(change) => handleUniqueChange(field.fieldName, change as boolean)} />
                                                        <Label className="ml-2" htmlFor="uniques">Is Unique<br></br></Label>
                                                    </div>
                                                    <div>
                                                        {/*Do I want to put in the effort to make a shadcn combobox for this component? Not really */}
                                                        <Label htmlFor="keyTypes">Key Type</Label>
                                                        <Input className="mt-2 mb-6" id={printStrOption(field.keyType)} placeholder={printStrOption(field.keyType)} onChange={(event) => handleKeyTypeChange(field.fieldName, event)} />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="fieldChecks">Field Checks</Label>
                                                        <Input className="mt-2 mb-6" id={printStrOption(field.check)} placeholder={printStrOption(field.check)} onChange={(event) => handleCheckChange(field.fieldName, event)} />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="fieldIndexes">Field Indexes</Label>
                                                        <Input className="mt-2 mb-6" id={printStrOption(field.indexing)} placeholder={printStrOption(field.indexing)} onChange={(event) => handleIndexChange(field.fieldName, event)} />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="fieldComments">Field Comments</Label>
                                                        <Textarea className="mt-2 mb-6" id={printStrOption(field.comments)} placeholder={printStrOption(field.comments)} onChange={(event) => handleCommentChange(field.fieldName, event)} />
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    </li>
                                ))}
                                <div className="flex flex-wrap items-center justify-center">
                                    <Button className="bg-green-600 m-2" onClick={() => addField(nodeData)}> Add New Field</Button>
                                    <Button className="m-2" onClick={() => updateData(nodeData)}>Update Table</Button>
                                </div>
                            </ul>
                        </div>
                        )}
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="nodeData" className={isNestedTableType(nodeData) ? "block" : "hidden"}>
                    <AccordionTrigger>Nested Table Data</AccordionTrigger>
                    <AccordionContent className="bg-gray-300 dark:bg-gray-900 p-2 rounded-md">
                        {/*Excel Table Data Accordian */}
                        {isNestedTableType(nodeData) && (
                            <div>
                                <ul>
                                    {nodeData.tableData.map((sheet, index) => (
                                        <li key={index}>
                                            <Accordion type="single" collapsible className="w-full">
                                                <AccordionItem value={`nodeData-${sheet.sheetName}`}>
                                                    <div className="flex items-center justify-between w-full">
                                                    <AccordionTrigger className="flex">{sheet.sheetName}</AccordionTrigger>
                                                    <Button variant="destructive" className="flex justify-end" onClick={() => deleteNSheet(nodeData, sheet.sheetName)}>
                                                        <X />
                                                    </Button>
                                                    </div>
                                                    <AccordionContent className="space-y-5">
                                                        <div>
                                                            <Label htmlFor="sheetName">Sheet Name</Label>
                                                            <Input id={sheet.sheetName} placeholder={sheet.sheetName} onChange={(event) => handleNSheetNameChange(sheet.sheetName, event)} />
                                                        </div>
                                                        <ul>
                                                        {sheet.sheetData.map((field, indexS) => (
                                                            <li key={indexS}>
                                                                <Accordion type="single" collapsible className="w-4/5 ml-auto">
                                                                    <AccordionItem value={`${sheet.sheetName}-${field.fieldName}`}>
                                                                        <div className="flex items-center justify-between w-full">
                                                                        <AccordionTrigger className="flex">{field.fieldName}</AccordionTrigger>
                                                                        <Button variant="destructive" className="flex justify-end" onClick={() => deleteNField(nodeData, sheet, field.fieldName)}>
                                                                            <X />
                                                                        </Button>
                                                                        </div>
                                                                        <AccordionContent className="space-y-5">
                                                                            <div>
                                                                                <Label htmlFor="efieldName">Field Name</Label>
                                                                                <Input id={field.fieldName} placeholder={field.fieldName} onChange={(event) => handleNFieldNameChange(`${sheet.sheetName}-${field.fieldName}`, event)}/>
                                                                            </div>
                                                                            <div>
                                                                                <Label htmlFor="efieldType">Field Format</Label>
                                                                                <Input id={field.fieldType} placeholder={field.fieldType} onChange={(event) => handleNFieldTypeChange(`${sheet.sheetName}-${field.fieldName}`, event)}/>
                                                                            </div>
                                                                            <div>
                                                                                <Label htmlFor="efieldDataValidation">Field Validation</Label>
                                                                                <Input id={printStrOption(field.check)} placeholder={printStrOption(field.check)} onChange={(event) => handleNCheckChange(`${sheet.sheetName}-${field.fieldName}`, event)}/>
                                                                            </div>
                                                                            <div>
                                                                                <Label htmlFor="efieldSort">Field Sort</Label>
                                                                                <Input id={printStrOption(field.sort)} placeholder={printStrOption(field.sort)} onChange={(event) => handleNSortChange(`${sheet.sheetName}-${field.fieldName}`, event)}/>
                                                                            </div>
                                                                            <div>
                                                                                <Label htmlFor="efieldComments">Field Comments</Label>
                                                                                <Textarea id={printStrOption(field.comments)} placeholder={printStrOption(field.comments)} onChange={(event) => handleNCommentChange(`${sheet.sheetName}-${field.fieldName}`, event)}/>
                                                                            </div>
                                                                        </AccordionContent>
                                                                    </AccordionItem>
                                                                </Accordion>
                                                            </li>
                                                        ))}
                                                        </ul>
                                                        <div className="flex justify-end">
                                                            <Button className="w-4/5 bg-green-600" onClick={() => addNField(nodeData, sheet)}>Add New Field</Button>
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        </li>
                                    ))}
                                </ul>
                                <div className="flex flex-wrap items-center justify-center">
                                    <Button className="m-2 bg-green-600" onClick={() => addNSheet(nodeData)}>Add Sheet</Button>
                                    <Button className="m-2 " onClick={() => updateData(nodeData)}>Update Data</Button>
                                </div>
                            </div>
                        )}
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="nodeData" className={nodeData.type==="customicon" ? "block" : "hidden"}>
                    <AccordionTrigger>Custom Image Upload</AccordionTrigger>
                    <AccordionContent className="bg-gray-300 dark:bg-gray-900 p-2 rounded-md">
                    <div id="importCustomImage-popup-overlay" >
                        <div className="p-6 rounded-lg shadow-lg w-30">
                            <h2 className="text-xl font-bold mb-4">
                                Upload a Custom Image
                            </h2>
                            <div id="import-drop-area"
                                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer transition hover:bg-gray-100 dark:hover:bg-gray-700 mb-4"
                                onClick={browseImg}
                                onDragOver={handleDragOver}
                                onDrop={handleImgDrop}>
                                <p className="text-gray-500">Drag & drop a file here or <span className="text-blue-500 font-semibold">click to browse</span></p>
                                <input id="image-file-upload" type="file" accept="image/jpeg, image/jpg, image/png" className="hidden" onChange={handleImgChange} />
                                <p id="image-name" className="mt-4 text-gray-700"></p>
                            </div>
                            <Button onClick={uploadImageToLocal}>Upload</Button>
                        </div>
                    </div>
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