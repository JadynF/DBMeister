import { readFile, writeFile } from "fs/promises";
import path from "path";
import { mkdir } from "fs";
import fs from "fs/promises";

export async function POST(req: Request) {
    try {
        const { file, fileName } = await req.json();
        if (!file) {
            return new Response(JSON.stringify({ response: "Error: No file received." }), {
                headers: { "Content-Type": "application/json" },
                status: 400
            });
        }

        // Convert file to buffer
        const buffer = Buffer.from(file.replace(/^data:.+;base64,/, ''), 'base64');
        // Define upload directory inside /tmp/
        let uploadDir = "./app/tmp/uploads";
        let accessUrlDir = "/api/customImageLocal?filePath=";
        if(process.platform === "win32"){
            uploadDir = ".\\app\\tmp\\uploads";
        }
        const filePath = path.join(uploadDir, fileName);
        // Ensure the directory exists. Tying this to a variable ensures the recursive function completes before moving on.
        //DO NOT REMOVE THIS VARIABLE
        const pauseForCreation = await mkdir(uploadDir, { recursive: true }, (err) => {
            if (err) console.error("Error creating directory:", err);
        });

        await writeFile(filePath, buffer);
        let accessUrl = `${accessUrlDir}${fileName}`;
        return new Response(JSON.stringify({ url: accessUrl }), {
            headers: { "Content-Type": "application/json" },
            status: 200
        });
    } catch (error) {
        console.error('Error saving file locally: ', error);
        return new Response(JSON.stringify({ response: "Failed to save file locally.", error: error }), {
            headers: { "Content-Type": "application/json" },
            status: 500
        });
    }
}

export async function GET(req: Request){
    try{
        const url = new URL(req.url);
        let filePath = url.searchParams.get("filePath");
        if(!filePath){
            return new Response(JSON.stringify({ response: "Error: No file received." }), {
                headers: { "Content-Type": "application/json" },
                status: 400
            });
        }
        filePath = path.join(process.cwd(), 'app', 'tmp', 'uploads', filePath);
        const buffer = await readFile(filePath);
        return new Response(buffer, {
            headers: { "Content-Type": "contentType" },
            status: 200
        });
    } catch (error) {
        console.error('Error getting local file: ', error);
        return new Response(JSON.stringify({ response: "Failed to grab local file.", error: error }), {
            headers: { "Content-Type": "application/json" },
            status: 500
        });
    }
}

export async function DELETE(req: Request){
    try{
        const { url } = await req.json();
        let mutation: string = url.split("=").pop() as string;
        if(!mutation){
            return new Response(JSON.stringify({ response: "Error: No file received." }), {
                headers: { "Content-Type": "application/json" },
                status: 400
            });
        }
        let filePath = path.join(process.cwd(), 'app', 'tmp', 'uploads', mutation);
        fs.unlink(filePath);
        return new Response(JSON.stringify({ response: "Success" }), {
            headers: { "Content-Type": "application/json" },
            status: 200
        });
    } catch(error) {
        console.error('Error deleting local file: ', error);
        return new Response(JSON.stringify({ response: "Failed to delete local file.", error: error }), {
            headers: { "Content-Type": "application/json" },
            status: 500
        });
    } 
}