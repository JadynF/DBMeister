import { Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Label } from "@/components/ui/label";

type TestData = { header: string; color: string};
type BasicType = {
    id: string,
    type: string,
    header: string,
    data: TestData
};

const defaultNodeData: TestData = {header: "Welcome", color:  "#FFD700"};

const BasicNode = ({data}: {data: TestData}) => {
    const nodeHeader = data.header || defaultNodeData.header;
    const nodeBGColor = data.color || defaultNodeData.color;

    return (
        <div className="w-[250px] h-[50px] border-2 bg-rose-400 border-black p-1.5 rounded-md align-center">
            <Handle type="target" position={Position.Top} style={{top: '-4px'}}/>
            <Label className="flex items-center justify-center align-center font-mono text-lg text-black">{nodeHeader}</Label>
            <Handle type="source" position={Position.Bottom} style={{bottom: '-4px'}}id="a" />
        </div>
    )
}

export default BasicNode;