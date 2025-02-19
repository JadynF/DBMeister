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
    type OnConnect,
    type OnNodesChange,
    type OnEdgesChange,
    type OnNodeDrag
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import ComponentsPane from "@/components/(projectEditor)/componentsPane";
import NodePropertiesPane from "@/components/(projectEditor)/nodePropertiesPane";
import EdgePropertiesPane from "@/components/(projectEditor)/edgePropertiesPane";
import { useParams } from 'next/navigation';
import authorization from '@/lib/authorization';
import authProject from '@/lib/authProjectEditor';

const SQLTableNode = dynamic(() => import('@/components/(xyflow)/sqlTable'), { ssr: false });
const ExcelTableNode = dynamic(() => import('@/components/(xyflow)/excelTable'), { ssr: false });
const BasicNode = dynamic(() => import('@/components/(xyflow)/basicNode'), { ssr: false });
const IconNode = dynamic(() => import('@/components/(xyflow)/iconNode'), {ssr: false});

const nodeTypes = {
    BasicNode: BasicNode,
    IconNode: IconNode,
    SQLTableNode: SQLTableNode,
    ExcelTableNode: ExcelTableNode
};

//New Node information types from Components Pane
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
};
type SQLTableType = {
    id: string,
    type: string,
    header: string,
    tableData: SQLTableDataType[]
};

type ExcelField = {
    fieldName: string,
    fieldType: string,
    check: string | null,
    sort: string | null,
    comments: string | null
};
type ExcelSheet = {
    sheetName: string,
    sheetData: ExcelField[]
};
type ExcelTableType = {
    id: string,
    type: string,
    header: string,
    tableData: ExcelSheet[]
};

//Default Nodes and Edges for testing
const loginNodes: Node[] = [
    { id: "1", type: "BasicNode", position: { x: 250, y: -50 }, data: { header: "Welcome", color:  "#FFD700"} },
    { id: "2", type: "BasicNode", position: { x: 100, y: 100 }, data: { header: "To", color: "#4169E1"} },
    { id: "3", type: "BasicNode", position: { x: 400, y: 250 }, data: { header: "DBMeister!", color: "#FFD700"} }
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
    const [nodeIDCounter, setIDCounter] = useState(4);
    const [selectedObject, setSelectedObject] = useState<Node | Edge>(loginNodes[0]);
    const [selectedStatus, setSelectedStatus] = useState(true);

    const onNodesChange: OnNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
    const onEdgesChange: OnEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
    const onConnect: OnConnect = useCallback((connection) => setEdges((eds) => addEdge(connection, eds)), []);

    const createNode = (nodeData: BasicType | IconType | SQLTableType | ExcelTableType, position: Position) => {
        let newNode: Node = {
            id: `${nodeIDCounter}`,
            position: position,
            data: {id: nodeIDCounter}
        }
        if(isBasicType(nodeData)){
            newNode = {...newNode, type: "BasicNode", data: {...newNode.data, type: "basic", header: nodeData.header, data: nodeData.data}};
        } else if(isIconType(nodeData)){
            newNode = {...newNode, type: "IconNode", data: {...newNode.data, type: "icon", header: nodeData.header, data: nodeData.data}};
        } else if(isSQLTableType(nodeData)){
            newNode = {...newNode, type: "SQLTableNode", data: {...newNode.data, type: "sql", header: nodeData.header, tableData: nodeData.tableData}};
        } else {
            newNode = {...newNode, type: "ExcelTableNode", data: {...newNode.data, type: "excel", header: nodeData.header, tableData: nodeData.tableData}};
        }
        setIDCounter(nodeIDCounter + 1);
        setNodes((nds) => nds.concat(newNode));
        setSelectedStatus(true);
        setSelectedObject(newNode);
    }

    const setSelectedNodePosition = (position: Position) => {
        if(selectedIsNode(selectedObject)){
            const updatedNodes = nodes.map((node) =>
                node.id === selectedObject.id ? { ...node, position: position } : node
            );
            setNodes(updatedNodes);
        }
    }
    const setSelectedNodeData = (nodeData: SQLTableType | ExcelTableType | IconType | BasicType) => {
        if(selectedIsNode(selectedObject)){
            let replacementNode: Node = {id: selectedObject.id, position: selectedObject.position, data: nodeData};
            if(isSQLTableType(nodeData)) {
                replacementNode = {...replacementNode, type: "SQLTableNode"};
            } else if(isExcelTableType(nodeData)) {
                replacementNode = {...replacementNode, type: "ExcelTableNode"};
            } else if(isIconType(nodeData)) {
                replacementNode = {...replacementNode, type: "IconNode"};
            } else {
                replacementNode = {...replacementNode, type: "BasicNode"};
            }
            const updatedNodes = nodes.map((node) => 
                node.id === selectedObject.id ? replacementNode : node
            );
            setNodes(updatedNodes);
        }
    }

    //Delete the selected node
    const deleteSelectedNode = (nodeId: string) => {
        if(selectedIsNode(selectedObject)){
            setSelectedStatus(false);
            setNodes((nds) => nds.filter((node) => node.id !== nodeId)); // Remove the node
            setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)); // Remove edges connected to the node
        }
    }

    const deletedSelectedEdge = (edgeId: string) => {
        if(selectedIsEdge(selectedObject)){
            setSelectedStatus(false);
            setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
        }
    }

    const animateEdge = (aniVal: boolean) => {
        if(selectedIsEdge(selectedObject)){
            let replacementEdge: Edge = {id: selectedObject.id, source: selectedObject.source, target: selectedObject.target, animated: aniVal};
            const updatedEdges = edges.map((edge) =>
            edge.id === selectedObject.id ? replacementEdge : edge);
            setEdges(updatedEdges);
        }
    }

    //Set the selected Reactflow element. Allows its properties to be displayed in the properties pane.
    const onNodeClick = (event: React.MouseEvent, node: Node) => {
        console.log(selectedObject);
        console.log("Node? ", selectedIsNode(selectedObject));
        console.log("Edge? ", selectedIsEdge(selectedObject));
        setSelectedStatus(true);
        setSelectedObject(node);
    }
    const onEdgeClick = (event: React.MouseEvent, edge: Edge) => {
        console.log(selectedObject);
        console.log(selectedIsNode(selectedObject));
        console.log("Edge? ", selectedIsEdge(selectedObject));
        setSelectedStatus(true);
        setSelectedObject(edge);
    }

    //Checks type of selectedObject
    const selectedIsNode = (data: any): data is Node => { return (data as Node).position !== undefined; }
    const selectedIsEdge = (data: any): data is Edge => { return (data as Edge).source !== undefined; }
    //Checks type of nodeData to determine data options in html
    const isExcelTableType = (data: any): data is ExcelTableType => { return (data as ExcelTableType).type === "excel"; }
    const isSQLTableType = (data: any): data is SQLTableType => { return (data as SQLTableType).type === "sql"; }
    const isBasicType = (data: any): data is BasicType => { return (data as BasicType).type === "basic"; }
    const isIconType = (data: any): data is IconType => { return (data as IconType).type === "icon"; }

    return (
        <div>
            <header style={taskbarStyle}>
                Taskbar
            </header>
            <div style={mainStyle}>
                <div style={sidepaneStyle}>
                    <ComponentsPane createNode={createNode} />
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
                        onEdgeClick={onEdgeClick}
                        fitView
                    >
                        <Controls />
                        <Background color="#aaa" gap={16} />
                    </ReactFlow>
                </div>
                <div style={sidepaneStyle}>
                    {selectedIsNode(selectedObject) && (
                        <NodePropertiesPane 
                        selectedNode={selectedObject} 
                        selectedStatus={selectedStatus}
                        setSelectedNodePosition={setSelectedNodePosition}
                        setSelectedNodeData={setSelectedNodeData}
                        deleteSelectedNode={deleteSelectedNode}
                    />
                    )}
                    {selectedIsEdge(selectedObject) && (
                        <EdgePropertiesPane
                            selectedEdge={selectedObject}
                            selectedStatus={selectedStatus}
                            animateEdge={animateEdge}
                            deleteSelectedEdge={deletedSelectedEdge}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

//Styles
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