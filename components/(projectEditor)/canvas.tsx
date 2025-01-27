"use client";

import { useState, useCallback } from "react";
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

const fitViewOptions: FitViewOptions = { padding: 0.2 };
const defaultEdgeOptions: DefaultEdgeOptions = { animated: true };
const onNodeDrag: OnNodeDrag = (_, node) => {
    console.log('drag event', node.data);
};

interface myCanvas {
    myNodes: Node[],
    myEdges: Edge[]
}

const Canvas: React.FC<myCanvas> = ({myNodes, myEdges}) => {
    console.log("Received these nodes: ", myNodes, myEdges);
    const [nodes, setNodes] = useState<Node[]>(myNodes);
    const [edges, setEdges] = useState<Edge[]>(myEdges);

    const onNodesChange: OnNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
    const onEdgesChange: OnEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
    const onConnect: OnConnect = useCallback((connection) => setEdges((eds) => addEdge(connection, eds)), []);

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeDrag={onNodeDrag}
            fitView
            fitViewOptions={fitViewOptions}
            defaultEdgeOptions={defaultEdgeOptions}
        >
            <Controls />
            <Background color="#aaa" gap={16} />
        </ReactFlow>
    )
}

export default Canvas;