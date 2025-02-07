import React from 'react';
import SQLTable from '@/components/(xyflow)/sqlTable';
import ExcelTable from '@/components/(xyflow)/excelTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


type NodeData = { header: string; color: string; };
type Position = { x: number; y: number; };

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
    tableData: SQLTableDataType[]
}

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
    header: string,
    tableData: ExcelSheet[]
}

type ComponentsPaneProps = {
    createNode: (nodeData: NodeData, position: Position) => void,
    createSQLTableNode: (nodeData: SQLTableType, position: Position) => void,
    createExcelTableNode: (nodeData: ExcelTableType, position: Position) => void;
};

const defaultSQLTableData: SQLTableDataType[] = [{fieldName: 'field_name', fieldType: 'VARCHAR(55)', nullability: true, keyType: null, unique: true, check: null, indexing: null, comments: 'comment'}];
const defaultExcelTableData: ExcelSheet = {sheetName: "Sheet 1", sheetData: [
    {fieldName: "Field 1", fieldFormat: "Text", fieldDataType: "Text", fieldDataValidation: null, fieldSort: "Ascending", fieldComments: null},
    {fieldName: "Field 2", fieldFormat: "Number", fieldDataType: "Number", fieldDataValidation: null, fieldSort: null, fieldComments: null}]};

const ComponentsPane: React.FC<ComponentsPaneProps> = ({ createNode, createSQLTableNode, createExcelTableNode }) => {
    const handleTestClick = (nodeData: NodeData) => {
        console.log('Component Clicked!');
        // The position where the node is created
        const position: Position = { x: 250, y: 150 }; // Modify this to be dynamic if needed
        createNode(nodeData, position);
    };

    const handleSQLClick = (nodeData: SQLTableType) => {
        console.log('SQL Table Component Clicked!');
        console.log(nodeData.id, nodeData.header, nodeData.tableData);
        const position: Position = {x: 100, y: 100};
        createSQLTableNode(nodeData, position);   
    }

    const handleExcelClick = (nodeData: ExcelTableType) => {
        console.log('Excel Table Component Clicked!');
        console.log(nodeData.id, nodeData.header, nodeData.tableData);
        const position: Position = {x: 100, y: 100};
        createExcelTableNode(nodeData, position);
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
                <div style={{ width: '100%', backgroundColor: '#f4f4f4', padding: '20px' }}>
                    <div
                        onClick={() => handleTestClick({ header: 'New Node', color: 'lightgreen' })}
                        style={{
                            padding: '10px',
                            backgroundColor: 'lightgreen',
                            marginBottom: '10px',
                            cursor: 'pointer',
                        }}
                    >
                        New Node
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="Tables">
                <div style={{ width: '100%', backgroundColor: '#f4f4f4', padding: '20px' }}>
                    <div
                        onClick={() => handleSQLClick({id: 'new_node', header: 'New_SQL_Table', tableData: defaultSQLTableData})}
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
                        onClick={() => handleExcelClick({id: 'new_excel_node', header: 'New_Excel_Table', tableData: [defaultExcelTableData]})}
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