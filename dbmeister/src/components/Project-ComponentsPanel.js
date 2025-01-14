import React from 'react';

const ComponentsPanel = ({ createNode }) => {
    
  const handleClick = (nodeData) => {
    // The position where the node is created
    const position = { x: 250, y: 150 }; // You can modify this to be dynamic based on the click location
    createNode(nodeData, position);
  };

  return (
    <div style={{ width: '100%', backgroundColor: '#f4f4f4', padding: '20px' }}>
      <h3>Components</h3>
      <div
        onClick={() => handleClick({ label: 'Node 1', color: 'lightblue'})}
        style={{ padding: '10px', backgroundColor: 'lightblue', marginBottom: '10px', cursor: 'pointer' }}
      >
        Node 1
      </div>
      <div
        onClick={() => handleClick({ label: 'Node 2', color: 'lightgreen'})}
        style={{ padding: '10px', backgroundColor: 'lightgreen', marginBottom: '10px', cursor: 'pointer' }}
      >
        Node 2
      </div>
    </div>
  );
};

export default ComponentsPanel;
