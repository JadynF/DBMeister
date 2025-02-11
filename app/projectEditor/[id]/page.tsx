'use client';
import { useState, useEffect, useCallback } from "react";
import dynamic from 'next/dynamic';
import {
    ReactFlow,
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    Controls,
    Background,
    type Node,
    type Edge,
    type FitViewOptions,
    type OnConnect,
    type OnNodesChange,
    type OnEdgesChange,
    type OnNodeDrag,
    type NodeTypes,
    type EdgeTypes,
    type DefaultEdgeOptions,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import ComponentsPane from "@/components/(projectEditor)/componentsPane";
import PropertiesPane from "@/components/(projectEditor)/propertiesPane";
const SQLTableNode = dynamic(() => import('@/components/(xyflow)/sqlTable'), { ssr: false });
const ExcelTableNode = dynamic(() => import('@/components/(xyflow)/excelTable'), { ssr: false });
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { useParams } from 'next/navigation';
import authorization from '@/lib/authorization';
import authProject from '@/lib/authProjectEditor';

const nodeTypes = {
    SQLTableNode: SQLTableNode,
    ExcelTableNode: ExcelTableNode
};

//Reactflow functionalities
const fitViewOptions: FitViewOptions = { padding: 0.2 };
const defaultEdgeOptions: DefaultEdgeOptions = { animated: true };
const onNodeDrag: OnNodeDrag = (_, node) => {
    console.log('drag event', node.data);
};

//New Node information types from Components Pane
type TestData = { label: string; color: string};
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
    type: string,
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
    type: string,
    header: string,
    tableData: ExcelSheet[]
}


//Default Nodes and Edges for testing
const loginNodes: Node[] = [
    { id: "1", position: { x: 250, y: -50 }, data: { label: "Welcome", color:  "#FFD700"}, style: {background: "#FFD700"}},
    { id: "2", position: { x: 100, y: 100 }, data: { label: "To", color: "#4169E1"}, style: {background: "#4169E1", color: "#ffffff"} },
    { id: "3", position: { x: 400, y: 250 }, data: { label: "DBMeister!", color: "#FFD700"}, style: {background: "#FFD700"} }
];
const loginEdges: Edge[] = [
    { id: "e1-2", source: "1", target: "2", animated: true },
    { id: "e2-3", source: "2", target: "3" },
];

export default function Project() {
    const params = useParams();

    const [projectId, setProjectId] = useState<string | undefined>(undefined);
    const [userId, setUserId] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (params.id) {
            setProjectId(params.id);  // Set the id from useParams
        }

        const checkAuth = async () => {
            const authResponse = await authorization();
            if (authResponse) {
                setUserId(authResponse.userData.id);
            }

            await authProject(authResponse.userData.id, params.id);
        }

        checkAuth();

        // get existing state data and apply to page

    }, []);

    const [nodes, setNodes] = useState<Node[]>(loginNodes);
    const [edges, setEdges] = useState<Edge[]>(loginEdges);
    const [selectedNode, setSelectedNode] = useState<Node>(loginNodes[0]);

    const onNodesChange: OnNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
    const onEdgesChange: OnEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
    const onConnect: OnConnect = useCallback((connection) => setEdges((eds) => addEdge(connection, eds)), []);

    const createNode = (nodeData: TestData, position: Position) => {
        // Handle the logic when the node is created
        const newNode: Node = {
            id: `${nodes.length + 1}`,
            position: position,
            data: {label: nodeData.label},
            style: {background: nodeData.color}
        };
        setNodes((nds) => nds.concat(newNode));
    }
    const createSQLTableNode = (nodeData: SQLTableType, position: Position) => {
        const newNode: Node = {
            id: `${nodes.length + 1}`,
            type: "SQLTableNode",
            position: position,
            data: {id: nodeData.id, type: "sql", header: nodeData.header, tableData: nodeData.tableData}
        }
        setNodes((nds) => nds.concat(newNode));
    }
    const createExcelTableNode = (nodeData: ExcelTableType, position: Position) => {
        const newNode: Node = {
            id: `${nodes.length + 1}`,
            type: "ExcelTableNode",
            position: position,
            data: {id: nodeData.id, type: "excel", header: nodeData.header, tableData: nodeData.tableData}
        }
        setNodes((nds) => nds.concat(newNode));
    }

    const setSelectedNodePosition = (position: Position) => {
        const updatedNodes = nodes.map((node) =>
            node.id === selectedNode.id ? { ...node, position: position } : node
        );
        setNodes(updatedNodes);
    }
    const setSelectedNodeData = (nodeData: SQLTableType | TestData) => {
        if(isSQLTableType(nodeData)) {
            const replacementSQLTableNode: Node = {id: selectedNode.id, type: "SQLTableNode", position: selectedNode.position, data: nodeData};
            const updatedNodes = nodes.map((node) => 
                node.id === selectedNode.id ? replacementSQLTableNode : node
            );
            setNodes(updatedNodes);
        }
        if(isExcelTableType(nodeData)) {
            const replacementExcelTableNode: Node = {id: selectedNode.id, type: "ExcelTableNode", position: selectedNode.position, data: nodeData};
            const updatedNodes = nodes.map((node) => 
                node.id === selectedNode.id ? replacementExcelTableNode : node
            );
            setNodes(updatedNodes);
        }
        if(isTestType(nodeData)) {
            const replacementTestNode: Node = {id: selectedNode.id, position: selectedNode.position, data: nodeData, style: {background: nodeData.color}};
            const updatedNodes = nodes.map((node) => 
                node.id === selectedNode.id ? replacementTestNode : node
            );
            setNodes(updatedNodes);
        }
    }

    //Delete the selected node
    const deleteSelectedNode = (nodeId: string) => {
        setNodes((nds) => nds.filter((node) => node.id !== nodeId)); // Remove the node
        setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)); // Remove edges connected to the node
    }

    //Set the selected Reactflow element. Allows its properties to be displayed in the properties pane.
    const onNodeClick = (event: React.MouseEvent, node: Node) => {
        console.log('Old selection: ', selectedNode.id);
        console.log('New selection: ', node.id);
        setSelectedNode(node);
    }

    //Checks type of nodeData to determine data options in html
    const isExcelTableType = (data: any): data is ExcelTableType => { return (data as ExcelTableType).tableData[0].sheetName !== undefined; }
    const isSQLTableType = (data: any): data is SQLTableType => { return (data as SQLTableType).tableData !== undefined; }
    const isTestType = (data: any): data is TestData => { return (data as TestData).color !== undefined; }

    return (
        <div>
            <header style={taskbarStyle}>
                Project {projectId}
            </header>
            <div style={mainStyle}>
                <div style={sidepaneStyle}>
                    <ComponentsPane 
                        createNode={createNode} 
                        createSQLTableNode={createSQLTableNode}
                        createExcelTableNode={createExcelTableNode}
                    />
                </div>
                <div style={{height: '100%', width: '100%' }}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        nodeTypes={nodeTypes}
                        onNodeClick={onNodeClick}
                        fitView
                    >
                        <Controls />
                        <Background color="#aaa" gap={16} />
                    </ReactFlow>
                </div>
                <div style={sidepaneStyle}>
                    <PropertiesPane 
                    selectedNode={selectedNode} 
                    setSelectedNodePosition={setSelectedNodePosition}
                    setSelectedNodeData={setSelectedNodeData}
                    deleteSelectedNode={deleteSelectedNode}
                    />
                </div>
            </div>
        </div>
    )
}

//Styles
const containerStyle: React.CSSProperties = {
    display: 'flex',
    height: '100%'
}

const taskbarStyle: React.CSSProperties = {
    backgroundColor: '#4169E1',
    color: 'white',
    padding: '10px',
    textAlign: 'center',
    fontSize: '18px',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 0
}

const mainStyle: React.CSSProperties = {
    display: 'flex',
    marginTop: '40px',
    height: 'calc(100vh - 40px)'
}

/* Left and Right Sidebars */
const sidepaneStyle: React.CSSProperties = {
    backgroundColor: '#f4f4f46b',
    width: '30%',
    padding: '20px',
    overflowY: 'auto'
}

/* Canvas Container (React Flow) */
const canvasStyle: React.CSSProperties = {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    maxWidth: '100%'
}

/* React Flow Canvas */
const reactflowRendererStyle: React.CSSProperties = {
    width: '80%',
    height: '80%',
    border: '2px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9'
}