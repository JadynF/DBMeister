import { Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Label } from "@/components/ui/label";

type ShapeData = {header: string, shape: string};
type ShapeType = {
    id: string,
    type: string,
    header: string,
    data: ShapeData
};

const defaultShapeData: ShapeData = {header: "Default Shape", shape: "square"};

const ShapeNode = ({data}: {data: ShapeType}) => {
    const nodeHeader = data.header || defaultShapeData.header;
    const nodeShape = data.data.shape || defaultShapeData.shape;

    if(nodeShape==="diamond"){
        return (
            <div className="relative aspect-[1/1]">
                {/* Diamond Shape */}
                <div className="w-full h-full bg-fuchsia-400 transform rotate-45 flex items-center justify-center border-2 border-black">
                    <span className="transform -rotate-45 font-mono text-white font-bold">{nodeHeader}</span>
                </div>
                
                {/* Handles */}
                <Handle type="source" position={Position.Right} className="!w-2 !h-2 bg-gray-800 -mr-6" />
                <Handle type="target" position={Position.Left} className="!w-2 !h-2 bg-gray-800 -ml-6" />
            </div>
        )
    } else if (nodeShape === "circle"){
        return (
            <div className="relative aspect-[1/1]">
                {/* Circle Shape */}
                <div className="w-full h-full bg-sky-400 rounded-full flex items-center justify-center border-2 border-black">
                    <span className="font-mono text-white font-bold">{nodeHeader}</span>
                </div>

                {/* Handles */}
                <Handle type="target" position={Position.Top} className="!w-2 !h-2 bg-gray-800 -mt-1" />
                <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 bg-gray-800 -mb-1" />
            </div>
        );
    } else if (nodeShape === "triangle") {
        return (
            <div className="relative aspect-[1/1] flex items-center justify-center">
                {/* Triangle Shape */}
                <div className="w-0 h-0
                    border-l-[50px] border-l-transparent
                    border-r-[50px] border-r-transparent
                    border-b-[100px] border-b-amber-500">
                </div>

                {/* Overlay text centered inside the triangle area */}
                <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <span className="font-mono text-black font-bold text-xs">{nodeHeader}</span>
                </div>

                {/* Handles */}
                <Handle type="target" position={Position.Top} className="!w-2 !h-2 bg-gray-800 -mt-1" />
                <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 bg-gray-800 -mb-1" />
            </div>
        );
    }else {
        return (
            <div className="relative aspect-[1/1]">
                {/* Square Shape */}
                <div className="w-full h-full bg-yellow-400 flex items-center justify-center border-2 border-black">
                    <span className="font-mono text-black font-bold">{nodeHeader}</span>
                </div>
                
                {/* Handles */}
                <Handle type="target" position={Position.Top} className="!w-2 !h-2 bg-gray-800 -mt-1" />
                <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 bg-gray-800 -mb-1" />
            </div>
        )
    }
}

export default ShapeNode;