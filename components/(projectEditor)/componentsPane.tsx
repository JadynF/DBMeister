import React from 'react';

type NodeData = { label: string; color: string; };
type Position = { x: number; y: number; };

type ComponentsPaneProps = {
    createNode: (nodeData: NodeData, position: Position) => void;
};

const ComponentsPane: React.FC<ComponentsPaneProps> = ({ createNode }) => {
    const handleClick = (nodeData: NodeData) => {
        console.log('Component Clicked!');
        // The position where the node is created
        const position: Position = { x: 250, y: 150 }; // Modify this to be dynamic if needed
        createNode(nodeData, position);
    };

    return (
        <div style={{ width: '100%', backgroundColor: '#f4f4f4', padding: '20px' }}>
            <h3>Components</h3>
            <div
                onClick={() => handleClick({ label: 'Node 1', color: 'lightblue' })}
                style={{
                    padding: '10px',
                    backgroundColor: 'lightblue',
                    marginBottom: '10px',
                    cursor: 'pointer',
                }}
            >
                Node 1
            </div>
            <div
                onClick={() => handleClick({ label: 'Node 2', color: 'lightgreen' })}
                style={{
                    padding: '10px',
                    backgroundColor: 'lightgreen',
                    marginBottom: '10px',
                    cursor: 'pointer',
                }}
            >
                Node 2
            </div>
        </div>
    );
}

export default ComponentsPane;