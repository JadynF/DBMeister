'use client';
import React, { useState, useEffect, useCallback, useRef } from "react";
import dynamic from 'next/dynamic';
import { ChevronLeft, ChevronRight, FileDown, Import, Save, House, CircleAlert, CircleCheckBig } from "lucide-react";
import Link from "next/link";
import {
    ReactFlow,
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    Controls,
    Background,
    Panel,
    useReactFlow,
    getNodesBounds,
    getViewportForBounds,
    type Node,
    type Edge,
    type OnConnect,
    type OnNodesChange,
    type OnEdgesChange,
    type OnNodeDrag,
    ReactFlowProvider
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { toPng, toJpeg } from 'html-to-image';
import jsPDF from 'jspdf';
import ComponentsPane from "@/components/(projectEditor)/componentsPane";
import NodePropertiesPane from "@/components/(projectEditor)/nodePropertiesPane";
import EdgePropertiesPane from "@/components/(projectEditor)/edgePropertiesPane";
import { useParams } from 'next/navigation';
import authorization from '@/lib/authorization';
import authProject from '@/lib/authProjectEditor';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { io } from "socket.io-client";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { toast } from "sonner";

const SQLTableNode = dynamic(() => import('@/components/(xyflow)/sqlTable'), { ssr: false });
const ExcelTableNode = dynamic(() => import('@/components/(xyflow)/excelTable'), { ssr: false });
const BasicNode = dynamic(() => import('@/components/(xyflow)/basicNode'), { ssr: false });
const IconNode = dynamic(() => import('@/components/(xyflow)/iconNode'), {ssr: false});
const ShapeNode = dynamic(() => import('@/components/(xyflow)/shapeNode'), {ssr: false});
import { saveProject, getProject } from '@/lib/stateManager';

const nodeTypes = {
    BasicNode: BasicNode,
    IconNode: IconNode,
    SQLTableNode: SQLTableNode,
    ExcelTableNode: ExcelTableNode,
    ShapeNode: ShapeNode
};

//New Node information types from Components Pane
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
type CustomIconType = {
    id: string,
    type: string,
    header: string,
    data: IconData
};
type SQLTableDataType = {
    fieldName: string,
    fieldType: string,
    nullability: boolean,
    keyType: string | null,
    unique: boolean,
    check: string | null,
    indexing: string | null,
    comments: string | null
};
type SQLTableType = {
    id: string,
    type: string,
    header: string,
    tableData: SQLTableDataType[]
};
type ExcelField = {
    fieldName: string,
    fieldType: string,
    check: string | null,
    sort: string | null,
    comments: string | null
};
type ExcelSheet = {
    sheetName: string,
    sheetData: ExcelField[]
};
type ExcelTableType = {
    id: string,
    type: string,
    header: string,
    tableData: ExcelSheet[]
};
type ShapeData = {header: string, shape: string};
type ShapeType = {
    id: string,
    type: string,
    header: string,
    data: ShapeData
};

//Default Nodes and Edges for testing
const loginNodes: Node[] = [
    { id: "0", type: "BasicNode", position: { x: 250, y: -50 }, data: { header: "Welcome", color:  "#FFD700"} }
];
const loginEdges: Edge[] = [];

export default function Project() {
    const params = useParams();

    const [projectId, setProjectId] = useState<string | undefined>(undefined);
    const [diagramData, setDiagramData] = useState(undefined);
    const [diagramName, setDiagramName] = useState("");
    const [userId, setUserId] = useState<string | undefined>(undefined);
    const [isAuth, setIsAuth] = useState<boolean>(false);

    const [importFile, setImFile] = useState<File | null>(null);
    const [cloudImgsToDelete, setImgsToDelete] = useState<string[]>([]);

    const [nodes, setNodes] = useState<Node[]>(loginNodes);
    const [edges, setEdges] = useState<Edge[]>(loginEdges);
    const [selectedObject, setSelectedObject] = useState<Node | Edge>(loginNodes[0]);
    const [selectedStatus, setSelectedStatus] = useState(true);

    const [compPaneMini, setCompMini] = useState(true);
    const [propPaneMini, setPropMini] = useState(true);
    const [importPop, setImPop] = useState(false);
    const [exportPop, setExPop] = useState(false);
    const [nodeIDCounter, setIDCounter] = useState<number>(1);

    const [loading, setIsLoading] = useState<boolean>(true);
    const [progress, setProgress] = useState(0);

    const [socket, setSocket] = useState(undefined);
    const [isJoined, setIsJoined] = useState(false);

    const [exportType, setExportType] = useState("dbmp");

    const [username, setUsername] = useState(undefined);
    const [connectedUsers, setConnectedUsers] = useState(undefined);
    const [isSaved, setIsSaved] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    const baseURL = process.env.NEXT_PUBLIC_API_SOCKET_URL;

    useEffect(() => {
        if (localStorage.getItem('theme') == "dark") {
            setDarkMode(true); 
            document.documentElement.className = "dark";
        }

        const newSocket = io(baseURL, { path: "/socket" });
        setSocket(newSocket);
        setProgress(prevProgress => prevProgress + 10);
        if (params.id) {
            setProjectId(params.id);
        }
        setProgress(prevProgress => prevProgress + 10);

    }, []);

    useEffect(() => {
        const checkAuth = async () => {
            const authResponse = await authorization();
            setProgress(prevProgress => prevProgress + 10);
            if (authResponse) {
                setUserId(authResponse.userData.id);
                setUsername(authResponse.userData.username);
                let authProj = await authProject(authResponse.userData.id, projectId);
                console.log(authProj);
                setDiagramData(authProj.diagramData[0]);
                setDiagramName(authProj.diagramData[0].name)
                setIsAuth(authProj.authorized);
            }
            setProgress(prevProgress => prevProgress + 10);
        }
        setProgress(prevProgress => prevProgress + 10);
        if (projectId)
            checkAuth();
        setProgress(prevProgress => prevProgress + 10);
    }, [projectId]);

    useEffect(() => { // only run once the user has been authorized for the project
        if (projectId && isAuth) {
            setProgress(prevProgress => prevProgress + 10);
            socket.emit('join-diagram', { diagramId: projectId, userData: username });
            setIsJoined(true);
            setProgress(100);
        }
    }, [isAuth]);

    useEffect(() => {
        if (socket) {
            socket.on("receive-state-update", ({recState, saved}) => {
                console.log("received socket update");
                console.log(recState);
                console.log(saved);
                setNodes(recState.nodes);
                setEdges(recState.edges);
                setIDCounter(recState.idCounter);
                setIsSaved(saved);
            });

            socket.on("receive-user-update", (data) => {
                console.log("receive user update");
                setConnectedUsers(data);
            })

            return () => {
                socket.off("receive-state-update");
                socket.off("receive-user-update");
                socket.emit("leave-room", params.id);
                socket.disconnect();
            };
        }
    }, [socket]);

    const updateSocketState = (newNodes, newEdges, newNodeIDCounter) => {
        if (socket) {
            const state = {"nodes": newNodes, "edges": newEdges, "idCounter": newNodeIDCounter};
            socket.emit("send-state-update", {diagramId: params.id, data: state});
        }
    }

    const updateNodeState = (changes) => {
        if (socket) {
            socket.emit("send-node-update", {diagramId: params.id, data: changes});
        }
    }

    useEffect(() => {
        if(progress >= 100 && isJoined && loading) { // strict mode will cause the page to mount twice, set to 100 if not set
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }
    }, [progress]);

    async function getFileFromPath(filePath: string) {
        const response = await fetch(filePath); // Fetch the file from local path
        const blob = await response.blob(); // Convert response to Blob
      
        // Create a File object (optional: provide a lastModified timestamp)
        return new File([blob], filePath.split("=").pop() as string, { type: blob.type });
    }
    async function fileToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    }

    const saveState = async () => {
        console.log(isAuth);
        if (userId && projectId && isAuth && !loading) { // protections from unauthorized saving states
            //Upload all new images to the cloud
            for(let i = 0; i < nodes.length; i++){
                let currNode = nodes[i];
                if(isCustomIconType(currNode.data)){
                    console.log(currNode.data.data.image);
                    console.log(!currNode.data.data.image.includes(process.env.NEXT_PUBLIC_API_CUSTOM_SPACES_ENDPOINT as string));
                    console.log(process.env.NEXT_PUBLIC_API_CUSTOM_SPACES_ENDPOINT);
                    if(!currNode.data.data.image.includes(process.env.NEXT_PUBLIC_API_CUSTOM_SPACES_ENDPOINT as string)){
                        //Upload file to cloud and replace link in node's data
                        let localFilePath = currNode.data.data.image; //currently the local file path
                        let imgFile = await getFileFromPath(localFilePath); //now the image file

                        if (!imgFile)
                            continue;

                        const base64File = await fileToBase64(imgFile); //imgFile is now a base64 string
                        const res = await fetch('/api/customImageCloud', {
                            method: 'POST',
                            headers: {
                            'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                projectID: projectId as string,
                                nodeID: currNode.id,
                                file: base64File as string,
                                fileName: imgFile.name,
                                fileType: imgFile.type,
                            })
                        });
                        const data = await res.json();
                        if (res.ok) {
                            currNode.data.data.image = data.url;
                        } else {
                            console.error('Upload failed:', data.message);
                            return;
                        }
                        //Delete local file
                        const resLoc = await fetch('/api/customImageLocal', {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                url: localFilePath
                            })
                        });
                        const delData = await resLoc.json();
                        if(resLoc.ok){
                            console.log(delData.response);
                        } else {
                            console.error('Local file deletion failed:', data.response);
                            return;
                        }
                    }
                };
            }
            //Delete all custom images from the cloud if they are no longer needed
            if(cloudImgsToDelete.length > 0){
                for(let i = 0; i < cloudImgsToDelete.length; i++){
                    const res = await fetch('/api/customImageCloud', {
                        method: 'DELETE',
                        headers: {
                        'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            fileName: cloudImgsToDelete[i]
                        }),
                    });
                    const data = await res.json();
                    if (res.ok) {
                        console.log(data.response);
                    } else {
                        console.error('Upload failed:', data.message);
                        return;
                    }
                }
                setImgsToDelete([]);
            }

            const flowNode = document.querySelector('.react-flow') as HTMLElement;
            if(flowNode) {
                console.log("trying to thumbnail");
                try {
                    const base64File = await toJpeg(flowNode, {backgroundColor: "#ffffff", cacheBust: true});
                    const res = await fetch('/api/customImageCloud', {
                        method: 'POST',
                        headers: {
                        'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            projectID: projectId as string,
                            nodeID: "",
                            file: base64File as string,
                            fileName: "thumbnail",
                            fileType: "data:image/jpeg;base64,",
                        })
                    });
                    const data = await res.json();
                    console.log(data.url);
                } catch (err) {
                  console.error('Error saving thumbnail:', err);
                }
            } else {
                console.log("no flowNode");
                return;
            }

            const state = {"nodes": nodes, "edges": edges};
            const saved = await saveProject(state, projectId);

            if (saved.saved) {
                socket.emit("send-saved-update", params.id);
                console.log("saved");
                toast("Diagram has been saved!", {
                    action: {
                      label: "Close"
                    }
                });
            }
            else {
                console.log("failed to save");
                toast("Failed to save diagram", {
                            action: {
                              label: "Close"
                            }
                });
            }
        }
    }

    function inlineAllStyles(node: HTMLElement) {
        const allElements = node.querySelectorAll('*');
        allElements.forEach((el) => {
            const computed = getComputedStyle(el);
            for (const key of computed) {
                (el as HTMLElement).style.setProperty(key, computed.getPropertyValue(key));
            }
        });
    }
    
    function inlineAndBackupStyles(node, backupMap) {
        const allElements = node.querySelectorAll('*');
        allElements.forEach((el) => {
            const computed = getComputedStyle(el);
            const original = {};
            for (const key of computed) {
                original[key] = el.style.getPropertyValue(key); // backup original inline
                el.style.setProperty(key, computed.getPropertyValue(key)); // apply computed as inline
            }
            backupMap.set(el, original);
        });
    }
    
    function restoreOriginalStyles(backupMap) {
        backupMap.forEach((original, el) => {
            for (const key in original) {
                if (original[key]) {
                    el.style.setProperty(key, original[key]);
                } else {
                    el.style.removeProperty(key);
                }
            }
        });
        backupMap.clear();
    }

    const exportProject = async () => {
        if (userId && projectId) {
            if(exportType==="dbmp"){
                const state = {"nodes": nodes, "edges": edges};
                const jsonString = JSON.stringify(state, null, 2);
                // Create a Blob object from the JSON string
                const blob = new Blob([jsonString], { type: 'application/json' });
                // Create a link element
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'dataflowproject.dbmp'; //custom file extension (.dbmp)
                // Trigger the download
                link.click();
                // Clean up the object URL to avoid memory leaks
                URL.revokeObjectURL(link.href);
            } else {
                const flowNode = document.querySelector('.react-flow') as HTMLElement;
                if(flowNode) {
                    const styleBackupMap = new Map();
                    try {
                        // Clone the node to avoid affecting the original DOM
                        inlineAndBackupStyles(flowNode, styleBackupMap);

                        if(exportType==="png"){
                            let dataUrl = await toPng(flowNode, {backgroundColor: "#ffffff", cacheBust: true});
                            //toJpeg same process, but different function here. Make function (imageDownload) and make it the else condition
                            let link = document.createElement('a');
                            link.download = 'dataflowproject.png';
                            link.href = dataUrl;
                            link.click();
                        }
                        if(exportType==="jpeg"){
                            let dataUrl = await toJpeg(flowNode, {backgroundColor: "#ffffff", cacheBust: true});
                            let link = document.createElement('a');
                            link.download = 'dataflowproject.jpeg';
                            link.href = dataUrl;
                            link.click();
                        } else if (exportType==="pdf"){
                            let dataUrl = await toPng(flowNode, {backgroundColor: "#ffffff", cacheBust: true});
                            const pdf = new jsPDF("l", "mm", "a4");
                            pdf.addImage(dataUrl, "PNG", 0, 0, pdf.internal.pageSize.width, pdf.internal.pageSize.height);
                            pdf.save('dataflowproject.pdf');
                        }
                    } catch (err) {
                    console.error('Error generating image:', err);
                    } finally {
                        // Always restore original styles after capture
                        restoreOriginalStyles(styleBackupMap);
                    }
                } else {
                    console.log("no flowNode");
                    return;
                }
            }
        }
    }

    const handleExportTypeChange = (event: React.MouseEvent<HTMLButtonElement>) => {
        setExportType(event.currentTarget.value);
        console.log(exportType);
    }

    const importProject = () => {
        if(!importFile){
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
              const state = JSON.parse(e.target.result);
              console.log(state);
              setNodes(state["nodes"]);
              setEdges(state["edges"]);
            } catch (err) {
              console.error('Error parsing JSON:', err);
            }
        };
        
        reader.readAsText(importFile);
        setImFile(null);
        document.getElementById('file-name').textContent = "";
        setImPop(!importPop);
    }
    // Trigger file browser when the drop area is clicked
    const browseFile = () => {
        document.getElementById('file-input')?.click();
    };
    // Handle drag over (prevent default to enable drop)
    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault(); // Allows the file to be dropped
        event.dataTransfer.dropEffect = 'copy'; // Shows "copy" cursor
    };
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0]; // `?.` handles if no file is selected
        if (selectedFile) {
          setImFile(selectedFile);
          displayFileName(selectedFile);
        }
    };
    // Handle file drop
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) {
            setImFile(file);
            displayFileName(file);
        }
    };
    // Display file name after selection
    const displayFileName = (file: any) => {
        document.getElementById('file-name').textContent = `Selected file: ${file.name}`;
    };

    const handleCompPaneMini = () => { setCompMini(!compPaneMini); }
    const handlePropPaneMini = () => { setPropMini(!propPaneMini); }
    const handleImPopChange = () => { setImPop(!importPop); }
    const handleExPopChange = () => { setExPop(!exportPop); }

    //const onNodesChange: OnNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
    const onNodesChange: OnNodesChange = useCallback((changes) => {
        console.log(changes);
        if (changes[0].type == "position") {
            updateNodeState(changes);
        }
        else {
            console.log("emitting");
            const updatedNodes = applyNodeChanges(changes, nodes); 
            updateSocketState(updatedNodes, edges, nodeIDCounter, loading);
        }
    }, [nodes, edges, nodeIDCounter]);
    
    //const onEdgesChange: OnEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
    const onEdgesChange: OnEdgesChange = useCallback((changes) => {
        const updatedEdges = applyEdgeChanges(changes, edges);
        updateSocketState(nodes, updatedEdges, nodeIDCounter, loading);
    }, [nodes, edges, nodeIDCounter]);

    //const onConnect: OnConnect = useCallback((connection) => setEdges((eds) => addEdge(connection, eds)), []);
    const onConnect: OnConnect = useCallback((connection) => {
        const updatedEdges = addEdge(connection, edges);
        updateSocketState(nodes, updatedEdges, nodeIDCounter, loading);
    }, [nodes, edges, nodeIDCounter]);

    const createNode = (nodeData: BasicType | IconType | SQLTableType | ExcelTableType | ShapeType, position: Position) => {
        let newNode: Node = {
            id: `${nodeIDCounter}`,
            position: position,
            data: {id: nodeIDCounter}
        }
        if(isBasicType(nodeData)){
            newNode = {...newNode, type: "BasicNode", data: {...newNode.data, type: "basic", header: nodeData.header, data: nodeData.data}};
        } else if(isIconType(nodeData)){
            newNode = {...newNode, type: "IconNode", data: {...newNode.data, type: nodeData.type, header: nodeData.header, data: nodeData.data}};
        } else if(isSQLTableType(nodeData)){
            newNode = {...newNode, type: "SQLTableNode", data: {...newNode.data, type: "sql", header: nodeData.header, tableData: nodeData.tableData}};
        } else if(isExcelTableType(nodeData)){
            newNode = {...newNode, type: "ExcelTableNode", data: {...newNode.data, type: "excel", header: nodeData.header, tableData: nodeData.tableData}};
        } else {
            newNode = {...newNode, type: "ShapeNode", data: {...newNode.data, type: "shape", header: nodeData.header, data: nodeData.data}};
        }
        setIDCounter(parseInt(nodeIDCounter) + 1);
        setNodes((nds) => nds.concat(newNode));
        setSelectedStatus(true);
        setSelectedObject(newNode);
    }

    const setSelectedNodePosition = (position: Position) => {
        if(selectedIsNode(selectedObject)){
            const updatedNodes = nodes.map((node) =>
                node.id === selectedObject.id ? { ...node, position: position } : node
            );
            updateSocketState(updatedNodes, edges, nodeIDCounter);
        }
    }
    const setSelectedNodeData = (nodeData: SQLTableType | ExcelTableType | IconType | BasicType | ShapeType) => {
        if(selectedIsNode(selectedObject)){
            let replacementNode: Node = {id: selectedObject.id, position: selectedObject.position, data: nodeData};
            if(isSQLTableType(nodeData)) {
                replacementNode = {...replacementNode, type: "SQLTableNode"};
            } else if(isExcelTableType(nodeData)) {
                replacementNode = {...replacementNode, type: "ExcelTableNode"};
            } else if(isIconType(nodeData)) {
                replacementNode = {...replacementNode, type: "IconNode"};
            } else if(isBasicType(nodeData)){
                replacementNode = {...replacementNode, type: "BasicNode"};
            } else {
                replacementNode = {...replacementNode, type: "ShapeNode"};
            }
            const updatedNodes = nodes.map((node) => 
                node.id === selectedObject.id ? replacementNode : node
            );
            updateSocketState(updatedNodes, edges, nodeIDCounter);
        }
    }

    //Delete the selected node
    const deleteSelectedNode = (nodeId: string) => {
        if(selectedIsNode(selectedObject)){
            if(isCustomIconType(selectedObject.data)){
                let imgStr: string = selectedObject.data.data.image;
                setImgsToDelete(prevImages => [...prevImages, imgStr]);
            }
            setSelectedStatus(false);
            updateSocketState(nodes.filter((node) => node.id !== nodeId), edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId), nodeIDCounter);
        }
    }

    const deletedSelectedEdge = (edgeId: string) => {
        if(selectedIsEdge(selectedObject)){
            setSelectedStatus(false);
            updateSocketState(nodes, edges.filter((edge) => edge.id !== edgeId), nodeIDCounter);
        }
    }

    const animateEdge = (aniVal: boolean) => {
        if(selectedIsEdge(selectedObject)){
            let replacementEdge: Edge = {id: selectedObject.id, source: selectedObject.source, target: selectedObject.target, animated: aniVal};
            const updatedEdges = edges.map((edge) =>
            edge.id === selectedObject.id ? replacementEdge : edge);
            updateSocketState(nodes, updatedEdges, nodeIDCounter);
        }
    }

    //Set the selected Reactflow element. Allows its properties to be displayed in the properties pane.
    const onNodeClick = (event: React.MouseEvent, node: Node) => {
        setSelectedStatus(true);
        setSelectedObject(node);
    }
    const onEdgeClick = (event: React.MouseEvent, edge: Edge) => {
        setSelectedStatus(true);
        setSelectedObject(edge);
    }

    //Checks type of selectedObject
    const selectedIsNode = (data: any): data is Node => { return (data as Node).position !== undefined; }
    const selectedIsEdge = (data: any): data is Edge => { return (data as Edge).source !== undefined; }
    //Checks type of nodeData to determine data options in html
    const isExcelTableType = (data: any): data is ExcelTableType => { return (data as ExcelTableType).type === "excel"; }
    const isSQLTableType = (data: any): data is SQLTableType => { return (data as SQLTableType).type === "sql"; }
    const isBasicType = (data: any): data is BasicType => { return (data as BasicType).type === "basic"; }
    const isIconType = (data: any): data is IconType => { return (data as IconType).type === "icon" || (data as IconType).type === "customicon"; }
    const isCustomIconType = (data: any): data is CustomIconType => { return (data as CustomIconType).type === "customicon"; }

    return (
        <div className="flex flex-col h-screen overflow-hidden">
          {/* Loading Screen */}
          <div className={`bg-white dark:bg-gray-900 absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center transition-opacity duration-500 ease-out ${loading ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            <h1 className="text-4xl mb-4">Loading Your Project...</h1>
            <Progress value={progress} className="w-[60%]" />
          </div>
      
          {/* Main Content */}
          <div className={`${loading ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'} flex flex-col flex-1 transition-opacity duration-500 ease-in h-full`}>
            
            {/* Header / Taskbar */}
            <header className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white p-2 text-lg flex justify-between items-center z-10">
              <div className="flex items-center w-[40%] justify-start items-center">
                <Button variant="ghost" onClick={saveState}><Save />Save</Button>
                <Button variant="ghost" onClick={handleExPopChange}><FileDown />Export</Button>
                <Button variant="ghost" onClick={handleImPopChange}><Import />Import</Button>
              </div>
              <div className="text-2xl font-bold w-[20%] flex justify-center items-center">{diagramName}</div>
              <div className="flex items-center w-[40%] justify-end items-center">
                <div className="mr-6">
                  {isSaved ? (
                    <div className="flex items-center">
                      <CircleCheckBig />
                      <p className="ml-2">Saved</p>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <CircleAlert />
                      <p className="ml-2">Not Saved</p>
                    </div>
                  )}
                </div>
                {Array.isArray(connectedUsers) && connectedUsers.length > 0 && connectedUsers.map((user) => (
                  <HoverCard key={user}>
                    <HoverCardTrigger>
                      <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center text-sm font-semibold shadow mx-2">
                        {user.charAt(0)}
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-auto minw-0">
                      <div className="flex w-auto h-auto">
                        {user}
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                ))}
                <Link href="/dashboard">
                  <Button variant="ghost"><House /></Button>
                </Link>
              </div>
            </header>
      
            {/* Popups */}
            {/* Import Popup */}
            <div id="import-popup-overlay" className={`${importPop ? 'fixed flex' : 'hidden'} top-0 left-0 w-full h-full bg-black bg-opacity-50 items-center justify-center z-50`}>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Import a Project</h2>
                <div id="import-drop-area"
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer transition hover:bg-gray-100 mb-4"
                  onClick={browseFile}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <p className="text-gray-500">Drag & drop a file here or <span className="text-blue-500 font-semibold">click to browse</span></p>
                  <input id="file-input" type="file" accept=".dbmp" className="hidden" onChange={handleFileChange} />
                  <p id="file-name" className="mt-4 text-gray-700"></p>
                </div>
                <div className="flex items-center justify-center">
                    <Button variant="destructive" onClick={handleImPopChange} className="mr-4">Close</Button>
                    <Button onClick={importProject}>Import</Button>
                </div>
              </div>
            </div>
      
            {/* Export Popup */}
            <div id="export-popup-overlay" className={`${exportPop ? 'fixed flex' : 'hidden'} top-0 left-0 w-full h-full bg-black bg-opacity-50 items-center justify-center z-50`}>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Export this project as...</h2>
                <RadioGroup defaultValue="dbmp" className="p-5">
                  {['dbmp', 'png', 'jpeg', 'pdf'].map(type => (
                    <div key={type} className="flex items-center space-x-2">
                      <RadioGroupItem value={type} id={`${type}-option`} onClick={handleExportTypeChange} />
                      <Label htmlFor={`${type}-option`}>{type.toUpperCase()}</Label>
                    </div>
                  ))}
                </RadioGroup>
                <div className="flex items-center justify-center">
                    <Button variant="destructive" onClick={handleExPopChange} className="mr-4">Close</Button>
                    <Button onClick={exportProject}>Export</Button>
                </div>
              </div>
            </div>
      
            {/* Main Workspace */}
            <div className="flex flex-1 h-full overflow-hidden bg-gray-200 dark:bg-gray-800">
              {/* Left Sidebar */}
              {compPaneMini ? (
                <div className="flex relative w-[20%] min-w-fit">
                  <Button variant="ghost"
                    className="w-[15%] absolute top-1/2 transform -translate-y-1/2 flex flex-col justify-center items-center h-full text-white bg-blue-600 hover:bg-blue-400"
                    onClick={handleCompPaneMini}
                  >
                    <div className="-rotate-90 w-max mb-5"><Label>Elements</Label></div>
                    <ChevronLeft />
                  </Button>
                  <div className="w-5/6 ml-auto p-5 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-track-gray-800">
                    <ComponentsPane createNode={createNode} />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center w-[3%] min-w-10">
                  <Button variant="ghost"
                    className="flex flex-col items-center justify-center text-white bg-blue-600 hover:bg-blue-400 h-full w-full"
                    onClick={handleCompPaneMini}
                  >
                    <div className="-rotate-90 w-max mb-5"><Label>Elements</Label></div>
                    <ChevronRight />
                  </Button>
                </div>
              )}
      
              {/* Main Canvas */}
              <div className="relative flex-1 bg-white">
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  nodeTypes={nodeTypes}
                  onNodeClick={onNodeClick}
                  onEdgeClick={onEdgeClick}
                  snapToGrid={true}
                  snapGrid={[25, 25]}
                  fitView
                  colorMode={darkMode ? "dark" : "light"}
                >
                  <Controls />
                  <Background className="dark:bg-gray-900" color="#aaa" gap={16} />
                </ReactFlow>
              </div>
      
              {/* Right Sidebar */}
              {propPaneMini ? (
                <div className="flex relative bg-gray-200 dark:bg-gray-800 w-[20%] min-w-fit h-full overflow-hidden">
                  <div className="w-5/6 p-5 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-track-gray-800">
                    {selectedIsNode(selectedObject) && (
                      <NodePropertiesPane
                        projectID={projectId}
                        selectedNode={selectedObject}
                        selectedStatus={selectedStatus}
                        setSelectedNodePosition={setSelectedNodePosition}
                        setSelectedNodeData={setSelectedNodeData}
                        deleteSelectedNode={deleteSelectedNode}
                      />
                    )}
                    {selectedIsEdge(selectedObject) && (
                      <EdgePropertiesPane
                        selectedEdge={selectedObject}
                        selectedStatus={selectedStatus}
                        animateEdge={animateEdge}
                        deleteSelectedEdge={deletedSelectedEdge}
                      />
                    )}
                  </div>
                  <Button variant="ghost"
                    className="w-[15%] absolute top-1/2 right-0 transform -translate-y-1/2 flex flex-col text-white items-center justify-center h-full bg-indigo-500 hover:bg-indigo-300"
                    onClick={handlePropPaneMini}
                  >
                    <div className="mb-5 rotate-90 w-max"><Label>Properties</Label></div>
                    <ChevronRight />
                  </Button>
                </div>
              ) : (
                <div className="bg-gray-100 flex items-center justify-center w-[3%] min-w-10">
                  <Button variant="ghost"
                    className="flex flex-col items-center justify-center text-white bg-indigo-500 hover:bg-indigo-300 h-full w-full"
                    onClick={handlePropPaneMini}
                  >
                    <div className="mb-5 rotate-90 w-max"><Label>Properties</Label></div>
                    <ChevronLeft />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      );
}