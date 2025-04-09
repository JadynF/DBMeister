'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Define props interface
interface GroupCardProps {
  groupData: {
    id: string;
    name: string;
    group_desc?: string;
  };
}

export default function CreateGroupCard({ groupData }: GroupCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(groupData.name);
  const [newDesc, setNewDesc] = useState(groupData.group_desc || "");

  return (
    <Card className="w-full max-w-md shadow-md">
      <CardHeader>
        {isEditing ? (
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="text-xl font-bold"
            onClick={(e) => { e.preventDefault(); e.stopPropagation();}}
            
            
          />
        ) : (
          <CardTitle className="text-xl font-bold">{groupData.name}</CardTitle>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            className="w-full"
            onClick={(e) => { e.preventDefault(); e.stopPropagation();}}
          />
        ) : (
          <CardDescription>
            {groupData.group_desc ? groupData.group_desc : "No description provided."}
          </CardDescription>
        )}
      </CardContent>
    </Card>
  );
}
