import React, {useCallback} from 'react';
import ReactFlow, { addEdge, MiniMap, Controls, Background, applyNodeChanges, applyEdgeChanges } from "reactflow";
import 'reactflow/dist/style.css';

const ReactFlowCanvas = ({ nodes, edges, setNodes, setEdges }) => {
  


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

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={(changes) => setNodes(changes)}
        onEdgesChange={(changes) => setEdges(changes)}
        onConnect={onConnect}
        fitView
      >
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
};

export default ReactFlowCanvas;
