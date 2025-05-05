import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

type Position = { x: number; y: number; };

type TestData = { header: string; color: string};
type BasicType = {
    id: string,
    type: string,
    header: string,
    data: TestData
};

type IconData = { header: string; image: string};
type IconType = {
    id: string,
    type: string,
    header: string,
    data: IconData
};

type ClassicTableDataType = {
    fieldName: string,
    fieldType: string,
    nullability: boolean,
    keyType: string | null,
    unique: boolean,
    check: string | null,
    indexing: string | null,
    comments: string | null
}
type ClassicTableType = {
    id: string,
    type: string,
    header: string,
    tableData: ClassicTableDataType[]
}

type NestedField = {
    fieldName: string,
    fieldType: string,
    check: string | null,
    sort: string | null,
    comments: string | null
}
type NestedSheet = {
    sheetName: string,
    sheetData: NestedField[]
}
type NestedTableType = {
    id: string,
    type: string,
    header: string,
    tableData: NestedSheet[]
}

type ShapeData = {header: string, shape: string};
type ShapeType = {
    id: string,
    type: string,
    header: string,
    data: ShapeData
};

type ComponentsPaneProps = {
    createNode: (nodeData: BasicType | IconType | ClassicTableType | NestedTableType | ShapeType, position: Position) => void
};

const defaultNodeData: TestData = {header: "Welcome", color:  "#FFD700"};
const defaultIconNodeData: IconData = {header: "New_Icon", image:  "/nodeIcons/alteryxIcon.png"};
const defaultClassicTableData: ClassicTableDataType[] = [{fieldName: 'field_name', fieldType: 'VARCHAR(55)', nullability: true, keyType: null, unique: true, check: null, indexing: null, comments: 'comment'}];
const defaultNestedTableData: NestedSheet[] = [
    {sheetName: "Sheet 1", sheetData: [
        {fieldName: "Column 1", fieldType: "Text", check: null, sort: null, comments: "First Comment!"}, 
        {fieldName: "Column 2", fieldType: "Number", check: null, sort: null, comments: "Second Comment!"}]},
    {sheetName: "Sheet 2", sheetData: [
        {fieldName: "Column 1", fieldType: "Currency", check: null, sort: null, comments: "Testing 1!"},
        {fieldName: "Column 2", fieldType: "Text", check: null, sort: null, comments: "Succeeding 1!"}]}   
];
const defaultShapeData: ShapeData = {header: "New_Shape", shape: "square"};

const icons = [
    {imageSrc: "/nodeIcons/alteryxIcon.png", imageLbl: "Alteryx Node"},
    {imageSrc: "/nodeIcons/talendIcon.png", imageLbl: "Talend Node"},
    {imageSrc: "/nodeIcons/nifiIcon.png", imageLbl: "ApacheNifi Node"},
    {imageSrc: "/nodeIcons/pentahoIcon.png", imageLbl: "Pantaho Node"},
    {imageSrc: "/nodeIcons/powerqueryIcon.png", imageLbl: "PowerQuery Node"},
    {imageSrc: "/nodeIcons/powerbiIcon.png", imageLbl: "PowerBI Node"},
    {imageSrc: "/nodeIcons/tableauIcon.png", imageLbl: "Tableau Node"},
    {imageSrc: "/nodeIcons/lookerIcon.png", imageLbl: "Looker Node"}
]
const tables = [
    {imageSrc: "/resources/exampleBasicNode.PNG", imageLbl: "Basic Node", type: 'basic'},
    {imageSrc: "/resources/exampleClassicTable.PNG", imageLbl: "Classic Table", type: 'classic'},
    {imageSrc: "/resources/exampleNestedTable.PNG", imageLbl: "Nested Table", type: 'nested'}
]
const shapes = [
    {shape: "diamond", shapeLabel: "Diamond", imageSrc: "/resources/exampleDiamond.PNG"},
    {shape: "square", shapeLabel: "Square", imageSrc: "/resources/exampleSquare.PNG"},
    {shape: "circle", shapeLabel: "Circle", imageSrc: "/resources/exampleCircle.PNG"},
    {shape: "triangle", shapeLabel: "Triangle", imageSrc: "/resources/exampleTriangle.PNG"}
]

const ComponentsPane: React.FC<ComponentsPaneProps> = ({ createNode }) => {
    const handleClick = (type: string) => {
        if(type==="classic"){
            let classicDataGuard = structuredClone(defaultClassicTableData);
            const newNodeData: ClassicTableType = {
                id: 'new_classic_node',
                type: 'sql',
                header: 'New_Classic_Table',
                tableData: classicDataGuard
            }
            const position: Position = {x: 100, y: 100};
            createNode(newNodeData, position); 
        } else if(type==="nested"){
            let nestedDataGuard = structuredClone(defaultNestedTableData);
            const newNodeData: NestedTableType = {
                id: 'new_nested_node',
                type: 'excel',
                header: 'New_Nested_Table',
                tableData: nestedDataGuard
            }
            const position: Position = {x: 100, y: 100};
            createNode(newNodeData, position);
        } else {
            let basicDataGuard = structuredClone(defaultNodeData);
            const newNodeData: BasicType = {
                id: 'new_basic_node',
                type: 'basic',
                header: 'New Basic Node',
                data: basicDataGuard
            }
            const position: Position = { x: 250, y: 150 }; // Modify this to be dynamic if needed
            createNode(newNodeData, position);
        }
    };

    const handleIconClick = (type: string, imageSrc: string) => {
        let iconDataGuard = structuredClone(defaultIconNodeData);
        const newNodeData: IconType = {
            id: `new-${type}-node`,
            type: type, //allows icon or customicon
            header: 'New_Icon',
            data: {header: iconDataGuard.header, image: imageSrc}
        }
        const position: Position = {x: 100, y: 100};
        createNode(newNodeData, position);
    }

    const handleShapeClick = (inShape: string) => {
        let shapeDataGuard = structuredClone(defaultShapeData);
        const newNodeData: ShapeType = {
            id: `new_${inShape}_node`,
            type: 'shape',
            header: 'New_Shape_Node',
            data: {header: shapeDataGuard.header, shape: inShape}
        }
        const position: Position = {x: 100, y: 100};
        createNode(newNodeData, position);
    }

    return (
        <>
        <h3 className="text-center mb-2">Elements</h3>
        <Tabs defaultValue="Icons" className="w-auto">
            <TabsList>
                <TabsTrigger value="Icons">Icons</TabsTrigger>
                <TabsTrigger value="Tables">Tables</TabsTrigger>
                <TabsTrigger value="Shapes">Shapes</TabsTrigger>
            </TabsList>
            <TabsContent value="Icons">
            <div className="grid grid-cols-2 gap-4">
                {icons.map((icon, index) => (
                    <div key={index} className="flex flex-col items-center border" onClick={() => handleIconClick("icon", icon.imageSrc)} style={{cursor: "pointer"}}>
                        <Image 
                            src={icon.imageSrc} 
                            alt={icon.imageLbl} 
                            width={100} 
                            height={100}
                            priority={icon.imageSrc === "/nodeIcons/alteryxIcon.png" ? true : false}
                            className="mb-2" />
                        <span className="text-center text-sm font-medium">{icon.imageLbl}</span>
                    </div>
                ))}
                <div className="flex flex-col items-center border" onClick={() => handleIconClick("customicon", "/nodeIcons/custom.png")} style={{cursor: "pointer"}}>
                    <Image
                        src={"/nodeIcons/custom.png"}
                        alt={"Custom Icon"}
                        width={100}
                        height={100}
                        className="mb-2" />
                    <span className="text-center text-sm font-medium">Custom Icon</span>
                </div>
            </div>
            </TabsContent>
            <TabsContent value="Tables">
                <div className='grid grid-cols-1 gap-4'>
                    {tables.map((table, index) => (
                        <div key={index} className='flex flex-col items-center border p-5 curser-pointer' onClick={() => handleClick(table.type)} style={{cursor: "pointer"}}>
                            <Image
                                src={table.imageSrc}
                                alt={table.imageLbl}
                                width={200}
                                height={200}
                                className="mb-2" 
                            />
                            <span className="text-center text-sm font-medium font-mono">{table.imageLbl}</span>
                        </div>
                    ))}
                </div>
            </TabsContent>
            <TabsContent value="Shapes">
                <div className="grid grid-cols-2 gap-4">
                    {shapes.map((shape, index) => (
                        <div key={index} className="flex flex-col items-center border" onClick={() => handleShapeClick(shape.shape)} style={{cursor: "pointer"}}>
                            <Image
                                src={shape.imageSrc}
                                alt={shape.shapeLabel}
                                width={200}
                                height={200}
                                className="mb-2" 
                            />
                            <span className="text-center text-sm font-medium">{shape.shapeLabel}</span>
                        </div>
                    ))}
                </div>
            </TabsContent>
        </Tabs>
        </>
    );
}

export default ComponentsPane;