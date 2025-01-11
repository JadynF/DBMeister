import React, { useState, useCallback } from "react";
import ReactFlow, { addEdge, MiniMap, Controls, Background, applyNodeChanges, applyEdgeChanges } from "reactflow";
import "reactflow/dist/style.css";

const initialNodes = [
  { id: "1", position: { x: 250, y: -50 }, data: { label: "Welcome" }, style: {background: "#FFD700"}},
  { id: "2", position: { x: 100, y: 100 }, data: { label: "To" }, style: {background: "#4169E1", color: "#"} },
  { id: "3", position: { x: 400, y: 250 }, data: { label: "DBMeister!" }, style: {background: "#FFD700"} },
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e1-3", source: "2", target: "3" },
];

const Canvas = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    []
  );

  return (
    <div style={{ height: "100vh", width: "100%" }}>
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
  );
};

export default Canvas;
