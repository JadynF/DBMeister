import { PutObjectCommand } from '@aws-sdk/client-s3';
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from '@/lib/s3';


export async function POST(req: Request) {
  try {
    const { projectID, nodeID, file, fileName, fileType } = await req.json();
    const newName = `${projectID}-${nodeID}-${fileName}`;

    // Convert base64 to buffer
    const buffer = Buffer.from(file.replace(/^data:.+;base64,/, ''), 'base64');
    const toUpload = {
        Bucket: process.env.CUSTOMIMG_SPACES_BUCKETNAME as string,
        Key: newName as string,
        Body: buffer,
        ContentType: fileType as string,
        ACL: 'public-read', // Allow public access
    };
    await s3Client.send(new PutObjectCommand(toUpload)); //Ignore this warning. Its stupid
    const fileUrl = `${process.env.CUSTOMIMG_SPACES_ENDPOINT}/${process.env.CUSTOMIMG_SPACES_BUCKETNAME}/${newName}`;

    return new Response(JSON.stringify({ url: fileUrl }), {
        headers: { "Content-Type": "application/json" },
        status: 200
    });
  } catch (error) {
    console.error('Upload error:', error);
    return new Response(JSON.stringify({ response: "Failed to upload file.", error: error }), {
        headers: { "Content-Type": "application/json" },
        status: 500
    });
  }
}

export async function DELETE(req: Request) {
    const { fileName } = await req.json();
    const fileNameArray = fileName.split("/");
    let trueFileName = fileNameArray[fileNameArray.length - 1];
    console.log("Attempting to delete image from cloud...");
    if(!fileName){
        return new Response(JSON.stringify({ response: "Error: No filename received." }), {
            headers: { "Content-Type": "application/json" },
            status: 400
        });
    }
    const toDelete = {
        Bucket: process.env.CUSTOMIMG_SPACES_BUCKETNAME as string,
        Key: trueFileName
    }
    try {
        await s3Client.send(new DeleteObjectCommand(toDelete));
        console.log("Successfully deleted image from cloud!");
        return new Response(JSON.stringify({ response: "Deletion from cloud successful." }), {
            headers: { "Content-Type": "application/json" },
            status: 200
        });
    } catch (error) {
        console.error('Upload error:', error);
        return new Response(JSON.stringify({ response: "Failed to delete file from the cloud.", error: error }), {
            headers: { "Content-Type": "application/json" },
            status: 500
        });
    }
}