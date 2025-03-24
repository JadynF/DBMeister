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

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this group?")) return;

    try {
      const response = await fetch('/api/deleteGroup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId: groupData.id }),
      });

      if (!response.ok) throw new Error('Failed to delete group');

      console.log('Group deleted successfully');
      // Optionally: refresh the page or update state
    } catch (error) {
      console.error(error);
      alert('Error deleting group');
    }
  };

  const handleEdit = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const response = await fetch('/api/editGroup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groupId: groupData.id,
          name: newName,
          description: newDesc
        }),
      });

      if (!response.ok) throw new Error('Failed to update group');

      groupData.name = newName;
      groupData.group_desc = newDesc;

      alert("Group updated successfully!");
      setIsEditing(false);
      // Optionally: refresh the page or update state
    } catch (error) {
      console.error(error);
      alert('Error updating group');
    }
  };

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
      <CardFooter className="flex justify-between">
        {isEditing ? (
          <>
            <Button variant="secondary" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsEditing(false); }}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleEdit}>
              Save
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsEditing(true); }}>
              Edit
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
