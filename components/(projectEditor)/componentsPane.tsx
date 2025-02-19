import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

type Position = { x: number; y: number; };

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
}
type SQLTableType = {
    id: string,
    type: string,
    header: string,
    tableData: SQLTableDataType[]
}

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

type ComponentsPaneProps = {
    createNode: (nodeData: BasicType | IconType | SQLTableType | ExcelTableType, position: Position) => void
};

const defaultNodeData: TestData = {header: "Welcome", color:  "#FFD700"};
const defaultIconNodeData: IconData = {header: "New_Icon", image:  "/nodeIcons/alteryxIcon.png"};
const defaultSQLTableData: SQLTableDataType[] = [{fieldName: 'field_name', fieldType: 'VARCHAR(55)', nullability: true, keyType: null, unique: true, check: null, indexing: null, comments: 'comment'}];
const defaultExcelTableData: ExcelSheet[] = [
    {sheetName: "Sheet 1", sheetData: [
        {fieldName: "Column 1", fieldType: "Text", check: null, sort: null, comments: "First Comment!"}, 
        {fieldName: "Column 2", fieldType: "Number", check: null, sort: null, comments: "Second Comment!"}]},
    {sheetName: "Sheet 2", sheetData: [
        {fieldName: "Column 1", fieldType: "Currency", check: null, sort: null, comments: "Testing 1!"},
        {fieldName: "Column 2", fieldType: "Text", check: null, sort: null, comments: "Succeeding 1!"}]}   
];

const icons = [
    {imageSrc: "/nodeIcons/alteryxIcon.png", imageLbl: "Alteryx Node"},
    {imageSrc: "/nodeIcons/talendIcon.png", imageLbl: "Talend Node"},
    {imageSrc: "/nodeIcons/nifiIcon.png", imageLbl: "ApacheNifi Node"},
    {imageSrc: "/nodeIcons/pentahoIcon.png", imageLbl: "Pantaho Node"},
    {imageSrc: "/nodeIcons/powerqueryIcon.png", imageLbl: "PowerQuery Node"},
    {imageSrc: "/nodeIcons/powerbiIcon.png", imageLbl: "PowerBI Node"},
    {imageSrc: "/nodeIcons/tableauIcon.png", imageLbl: "Tableau Node"},
    {imageSrc: "/nodeIcons/lookerIcon.png", imageLbl: "Looker Node"}
]

const ComponentsPane: React.FC<ComponentsPaneProps> = ({ createNode }) => {
    const handleClick = (type: string) => {
        if(type==="sql"){
            let sqlDataGuard = structuredClone(defaultSQLTableData);
            const newNodeData: SQLTableType = {
                id: 'new_sql_node',
                type: 'sql',
                header: 'New_SQL_Table',
                tableData: sqlDataGuard
            }
            const position: Position = {x: 100, y: 100};
            createNode(newNodeData, position); 
        } else if(type==="excel"){
            let excelDataGuard = structuredClone(defaultExcelTableData);
            const newNodeData: ExcelTableType = {
                id: 'new_excel_node',
                type: 'excel',
                header: 'New_Excel_Table',
                tableData: excelDataGuard
            }
            const position: Position = {x: 100, y: 100};
            createNode(newNodeData, position);
        } else {
            let basicDataGuard = structuredClone(defaultNodeData);
            const newNodeData: BasicType = {
                id: 'new_basic_node',
                type: 'basic',
                header: 'New Basic Node',
                data: basicDataGuard
            }
            const position: Position = { x: 250, y: 150 }; // Modify this to be dynamic if needed
            createNode(newNodeData, position);
        }
    };

    const handleIconClick = (type: string, imageSrc: string) => {
        let iconDataGuard = structuredClone(defaultIconNodeData);
        const newNodeData: IconType = {
            id: 'new_icon_node',
            type: 'icon',
            header: 'New_Icon',
            data: {header: iconDataGuard.header, image: imageSrc}
        }
        const position: Position = {x: 100, y: 100};
        createNode(newNodeData, position);
    }

    return (
        <>
        <h3 className="text-center mb-2">Components</h3>
        <Tabs defaultValue="Icons" className="w-auto">
            <TabsList>
                <TabsTrigger value="Icons">Icons</TabsTrigger>
                <TabsTrigger value="Tables">Tables</TabsTrigger>
                <TabsTrigger value="Shapes">Shapes</TabsTrigger>
            </TabsList>
            <TabsContent value="Icons">
            <div className="grid grid-cols-2 gap-4">
                {icons.map((icon, index) => (
                    <div key={index} className="flex flex-col items-center border" onClick={() => handleIconClick("icon", icon.imageSrc)} style={{cursor: "pointer"}}>
                        <Image 
                            src={icon.imageSrc} 
                            alt={icon.imageLbl} 
                            width={100} 
                            height={100}
                            priority={icon.imageSrc === "/nodeIcons/alteryxIcon.png" ? true : false}
                            className="mb-2" />
                        <span className="text-center text-sm font-medium">{icon.imageLbl}</span>
                    </div>
                ))}
            </div>
            </TabsContent>
            <TabsContent value="Tables">
                <div style={{ width: '100%', backgroundColor: '#f4f4f4', padding: '20px' }}>
                    <div
                        onClick={() => handleClick("basic")}
                        style={{
                            padding: '10px',
                            backgroundColor: 'yellow',
                            marginBottom: '10px',
                            cursor: 'pointer',
                        }}
                    >
                        New Basic Node
                    </div>
                    <div
                        onClick={() => handleClick("sql")}
                        style={{
                            padding: '10px',
                            backgroundColor: 'lightblue',
                            marginBottom: '10px',
                            cursor: 'pointer'
                        }}
                    >
                        New SQL Table
                    </div>
                    <div
                        onClick={() => handleClick("excel")}
                        style={{
                            padding: '10px',
                            backgroundColor: 'lightgreen',
                            marginBottom: '10px',
                            cursor: 'pointer'
                        }}
                    >
                        New Excel Table
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="Shapes">Insert Shape</TabsContent>
        </Tabs>
        </>
    );
}

export default ComponentsPane;