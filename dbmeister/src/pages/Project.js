import React, {useState, useEffect, useCallback} from "react";
import ReactFlow, { addEdge, MiniMap, Controls, Background, useNodesState, useEdgesState, applyNodeChanges, applyEdgeChanges } from "reactflow";
import ComponentsPanel from "../components/Project-ComponentsPanel";
import ReactFlowCanvas from "../components/ReactFlowCanvas";
import { Link, useNavigate } from 'react-router-dom';
import "reactflow/dist/style.css";
import "./Project.css";

const defaultNodes = [
    { id: "1", position: { x: 250, y: -50 }, data: { label: "Welcome" }, style: {background: "#FFD700"}},
    { id: "2", position: { x: 100, y: 100 }, data: { label: "To" }, style: {background: "#4169E1", color: "#ffffff"} },
    { id: "3", position: { x: 400, y: 250 }, data: { label: "DBMeister!" }, style: {background: "#FFD700"} },
];
const defaultEdges = [
    { id: "e1-2", source: "1", target: "2", animated: true },
    { id: "e2-3", source: "2", target: "3" },
];

export default function Project() {
    //Canvas map handling
    const [nodes, setNodes] = useNodesState(defaultNodes);
    const [edges, setEdges] = useEdgesState(defaultEdges);

    //Canvas map change functions
    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []
    );
    const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []
    );
    const onConnect = useCallback(
        (connection) => setEdges((eds) => addEdge(connection, eds)), []
    );

    // Function to handle creating a new node when a side panel item is clicked
    const createNode = (nodeData, position) => {
        const newNode = {
        id: `${nodes.length + 1}`,
        position,
        data: { label: nodeData.label },
        style: {background: nodeData.color}
        };
        setNodes((nds) => nds.concat(newNode));
    };


    return (
        <div>
          <header className="taskbar">
            Taskbar
          </header>
            <div className="main-content">
                <div className="sidebar left">
                    <ComponentsPanel createNode={createNode}/>
                </div>
                <div style={{ height: "100%", width: "100%" }}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        fitView
                    >
                        <Controls />
                        <Background color="#aaa" gap={16} />
                    </ReactFlow>
                </div>
                <div className="sidebar right">
                    Properties
                </div>
            </div>
          </div>
    );
}