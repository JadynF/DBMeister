// app/forums/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import authorization from "@/lib/authorization";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { MessageSquare, Search, Plus } from "lucide-react";
import PostCard from "./PostCard";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

type UserData = {
  id: number;
  firstName: string;
  lastName: string;
};

type Reply = {
  id: number;
  user: string;
  content: string;
  user_id: number;
  date_made: string;
};

type Comment = {
  id: number;
  user: string;
  content: string;
  user_id: number;
  date_made: string;
  replies: Reply[];
};

type Post = {
  id: number;
  title: string;
  text: string;
  user: string;
  user_id: number;
  date_made: string;
  comments: Comment[];
};

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-US", {
    timeZone: "America/Chicago",
    year:     "numeric",
    month:    "short",
    day:      "numeric"
  });

export default function ForumPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newHeader, setNewHeader] = useState("");
  const [newPost, setNewPost] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/forums");
      const { posts: raw } = await res.json();
      const formatted = (raw as any[]).map((p) => ({
        ...p,
        date_made: formatDateTime(p.date_made),
        comments: p.comments.map((c: any) => ({
          ...c,
          date_made: formatDateTime(c.date_made),
          replies: c.replies.map((r: any) => ({
            ...r,
            date_made: formatDateTime(r.date_made),
          })),
        })),
      }));
      setPosts(formatted);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const auth = await authorization();
        setUserData(auth.userData);
        await fetchPosts();
      } catch (err) {
        console.error("Init error:", err);
      } finally {
        setInitialLoading(false);
      }
    })();
  }, []);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) return;
    await fetch("/api/forums", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "post",
        userId: userData.id,
        title: newHeader,
        text: newPost,
      }),
    });
    setNewHeader("");
    setNewPost("");
    setIsCreatePostOpen(false);
    await fetchPosts();
  };

  const handleCommentSubmit = async (postId: number, content: string) => {
    if (!userData) return;
    await fetch("/api/forums", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "comment",
        postId,
        userId: userData.id,
        content,
      }),
    });
    await fetchPosts();
  };

  const handleReplySubmit = async (
    postId: number,
    commentId: number,
    content: string
  ) => {
    if (!userData) return;
    await fetch("/api/forums", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "reply",
        postId,
        commentId,
        userId: userData.id,
        content,
      }),
    });
    await fetchPosts();
  };

  const handleDeletePost = async (id: number) => {
    await fetch("/api/forums", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "post", id }),
    });
    await fetchPosts();
  };

  const handleDeleteComment = async (id: number) => {
    await fetch("/api/forums", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "comment", id }),
    });
    await fetchPosts();
  };

  const handleDeleteReply = async (id: number) => {
    await fetch("/api/forums", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "reply", id }),
    });
    await fetchPosts();
  };

  const q = searchQuery.toLowerCase();
  const filtered = posts.filter((p) => {
    const t = p.title ?? "";
    const x = p.text ?? "";
    return t.toLowerCase().includes(q) || x.toLowerCase().includes(q);
  });

  if (!userData || initialLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-10 w-10 rounded-full border-t-4 border-blue-500" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <MessageSquare className="h-8 w-8 text-blue-600" />
          Forum Discussions
        </h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search…"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                New Discussion
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form
                onSubmit={handlePostSubmit}
                className="flex flex-col gap-4"
              >
                <Input
                  placeholder="Post title"
                  value={newHeader}
                  onChange={(e) => setNewHeader(e.target.value)}
                  required
                />
                <Textarea
                  placeholder="What's on your mind?"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  required
                />
                <Button type="submit">Create Post</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mb-8">
        <Accordion
          type="single"
          collapsible
          className="rounded-lg bg-slate-50 dark:bg-slate-800"
        >
          <AccordionItem value="faq">
            <AccordionTrigger className="px-4 py-2 font-semibold text-lg">
              Frequently Asked Questions
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 space-y-2 text-slate-700 dark:text-slate-300">
              <p>• Create discussions via “New Discussion.”</p>
              <p>• Add comments or replies to any post.</p>
              <p>• Delete your own content as needed.</p>
              <p>• Embed DBMeister diagrams for clarity!</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="space-y-6">
        {filtered.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onCommentSubmit={handleCommentSubmit}
            onReplySubmit={handleReplySubmit}
            onDeletePost={handleDeletePost}
            onDeleteComment={handleDeleteComment}
            onDeleteReply={handleDeleteReply}
            currentUserId={userData.id}
          />
        ))}
      </div>
    </>
  );
}
