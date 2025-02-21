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
    ReactFlowProvider,
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
import { useParams, useRouter } from 'next/navigation';
import authorization from '@/lib/authorization';
import authProject from '@/lib/authProjectEditor';

const SQLTableNode = dynamic(() => import('@/components/(xyflow)/sqlTable'), { ssr: false });
const ExcelTableNode = dynamic(() => import('@/components/(xyflow)/excelTable'), { ssr: false });
const BasicNode = dynamic(() => import('@/components/(xyflow)/basicNode'), { ssr: false });
const IconNode = dynamic(() => import('@/components/(xyflow)/iconNode'), { ssr: false });
import { saveProject, getProject } from '@/lib/stateManager';

const nodeTypes = {
    BasicNode: BasicNode,
    IconNode: IconNode,
    SQLTableNode: SQLTableNode,
    ExcelTableNode: ExcelTableNode
};

// Default Nodes and Edges for testing
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
    const router = useRouter();

    const [projectId, setProjectId] = useState<string | undefined>(undefined);
    const [userId, setUserId] = useState<string | undefined>(undefined);
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [nodeIDCounter, setIDCounter] = useState<number>(4);

    useEffect(() => {
        if (params.id) {
            setProjectId(params.id);
        }

        const checkAuth = async () => {
            const authResponse = await authorization();
            if (authResponse) {
                setUserId(authResponse.userData.id);
                let authProj = await authProject(authResponse.userData.id, params.id);
                setIsAuth(authProj);
            }
        }

        checkAuth();
    }, [params.id]);

    useEffect(() => { // only run once the user has been authorized for the project
        if (isAuth) {
            const getState = async () => {
                let savedState = await getProject(params.id);
    
                if (savedState) {
                    let maxID = 0;
                    for (let i in savedState.nodes) {
                        if (savedState.nodes[i].id > maxID) {
                            maxID = savedState.nodes[i].id;
                        }
                    }

                    setNodes(savedState.nodes);
                    setEdges(savedState.edges);
                    setIDCounter(maxID + 1);
                }
            }
    
            getState();
        }
    }, [isAuth]);

    const saveState = async () => {
        if (userId && projectId) {
            const state = {"nodes" : nodes, "edges" : edges};
            await saveProject(state, projectId);
        }
    };

    const [nodes, setNodes] = useState<Node[]>(loginNodes);
    const [edges, setEdges] = useState<Edge[]>(loginEdges);
    const [selectedObject, setSelectedObject] = useState<Node | Edge>(loginNodes[0]);
    const [selectedStatus, setSelectedStatus] = useState(true);

    const onNodesChange: OnNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
    const onEdgesChange: OnEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
    const onConnect: OnConnect = useCallback((connection) => setEdges((eds) => addEdge(connection, eds)), []);

    const createNode = (nodeData: any, position: Position) => {
        let newNode: Node = { id: `${nodeIDCounter}`, position: position, data: { id: nodeIDCounter } };
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
    const setSelectedNodeData = (nodeData: any) => {
        if(selectedIsNode(selectedObject)){
            let replacementNode: Node = { id: selectedObject.id, position: selectedObject.position, data: nodeData };
            const updatedNodes = nodes.map((node) => node.id === selectedObject.id ? replacementNode : node);
            setNodes(updatedNodes);
        }
    }

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
            let replacementEdge: Edge = { id: selectedObject.id, source: selectedObject.source, target: selectedObject.target, animated: aniVal };
            const updatedEdges = edges.map((edge) => edge.id === selectedObject.id ? replacementEdge : edge);
            setEdges(updatedEdges);
        }
    }

    // Set the selected Reactflow element
    const onNodeClick = (event: React.MouseEvent, node: Node) => {
        setSelectedStatus(true);
        setSelectedObject(node);
    }
    const onEdgeClick = (event: React.MouseEvent, edge: Edge) => {
        setSelectedStatus(true);
        setSelectedObject(edge);
    }

    // Check type of selectedObject
    const selectedIsNode = (data: any): data is Node => { return (data as Node).position !== undefined; }
    const selectedIsEdge = (data: any): data is Edge => { return (data as Edge).source !== undefined; }

    // Navigate to home or exit editor
    const navigateToHome = () => {
        router.push('/home');
    }

    const exitEditor = () => {
        router.push('/home');
    }

    return (
        <div>
            <header style={taskbarStyle}>
                <div style={navigationBarStyle}>
                    <button onClick={() => router.push('/home')}>Home</button>
                    <button onClick={() => router.push('/settings')}>Settings</button>
                    <button onClick={() => router.push('/profile')}>Profile</button>
                </div>
                <div>
                    <button onClick={saveState}>Save</button>
                </div>
                <div>
                    <button onClick={exitEditor}>Exit Editor</button>
                </div>
                <div>
                    Project {projectId}
                </div>
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
    );
}

// Styles
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
    zIndex: 0,
    display: 'flex',
    justifyContent: 'space-between'
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