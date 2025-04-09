import { Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Label } from "@/components/ui/label";
import Image from "next/image";

type IconData = { header: string; image: string};
type IconType = {
    id: string,
    type: string,
    header: string,
    data: IconData
};

const defaultIconNodeData: IconData = {header: "Icon", image:  "/nodeIcons/notFound.jpg"};

const IconNode = ({data}: {data: IconType}) => {
    //console.log(data.data.image); meant to check this every changing scenario is correct >:(
    const nodeHeader = data.header || defaultIconNodeData.header;
    const nodeImage = data.data.image || defaultIconNodeData.image;

    return (
        <div className="max-w-[200px]">
            <div className=" relative bg-white border-2 border-black p-1.5 rounded-md align-items">
                <Handle type="target" position={Position.Top} style={{top: '-4px'}}/>
                <div className="flex items-center justify-center">
                    <Image
                        src={nodeImage}
                        alt={nodeHeader}
                        width={100}
                        height={100}
                        fill={false}
                        quality={75}
                        priority={nodeImage === "/nodeIcons/alteryxIcon.png" ? true : false}
                        className="justify-center align-center"
                        unoptimized
                    />
                </div>
                <div className="flex justify-center font-mono text-black pt-2">
                    <Label className='text-xl'>{nodeHeader}</Label>
                </div>
                <Handle type="source" position={Position.Bottom} style={{bottom: '-4px'}}id="a" />
            </div>
        </div>
    )
}

export default IconNode;