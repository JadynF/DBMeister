// app/forums/PostCard.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Trash2 } from "lucide-react";

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

interface PostCardProps {
  post: Post;
  onCommentSubmit: (postId: number, content: string) => Promise<void>;
  onReplySubmit: (
    postId: number,
    commentId: number,
    content: string
  ) => Promise<void>;
  onDeletePost: (postId: number) => Promise<void>;
  onDeleteComment: (commentId: number) => Promise<void>;
  onDeleteReply: (replyId: number) => Promise<void>;
  currentUserId: number;
}

export default function PostCard({
  post,
  onCommentSubmit,
  onReplySubmit,
  onDeletePost,
  onDeleteComment,
  onDeleteReply,
  currentUserId,
}: PostCardProps) {
  const [commentContent, setCommentContent] = useState("");
  const [replyContents, setReplyContents] = useState<Record<number, string>>(
    {}
  );

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent) return;
    await onCommentSubmit(post.id, commentContent);
    setCommentContent("");
  };

  const handleReply = async (e: React.FormEvent, cid: number) => {
    e.preventDefault();
    const c = replyContents[cid] || "";
    if (!c) return;
    await onReplySubmit(post.id, cid, c);
    setReplyContents((prev) => ({ ...prev, [cid]: "" }));
  };

  return (
    <article className="p-6 bg-white dark:bg-slate-800 shadow rounded-lg space-y-4">
      {/* Post header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold dark:text-white">
            {post.title}
          </h2>
          <p className="text-xs text-gray-400">
            {post.user} • {post.date_made}
          </p>
        </div>
        {post.user_id === currentUserId && (
          <button
            onClick={() => onDeletePost(post.id)}
            aria-label="Delete post"
          >
            <Trash2 className="w-5 h-5 text-red-600" />
          </button>
        )}
      </div>

      {/* Body */}
      <p className="text-sm text-gray-700 dark:text-slate-300">
        {post.text}
      </p>

      {/* Comments */}
      <Accordion type="single" collapsible>
        <AccordionItem value={`comments-${post.id}`}>
          <AccordionTrigger className="font-medium">
            Comments ({post.comments.length})
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            {post.comments.map((comment) => (
              <div
                key={comment.id}
                className="pl-4 border-l border-gray-200 dark:border-slate-700 space-y-2"
              >
                {/* Single comment */}
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm dark:text-white">
                      <span className="font-semibold">{comment.user}</span>{" "}
                      {comment.content}
                    </p>
                    <p className="text-xs text-gray-400">
                      {comment.date_made}
                    </p>
                  </div>
                  {comment.user_id === currentUserId && (
                    <button
                      onClick={() => onDeleteComment(comment.id)}
                      aria-label="Delete comment"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  )}
                </div>

                {/* Replies */}
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="pl-4 space-y-1">
                    <div className="flex justify-between">
                      <p className="text-sm dark:text-white">
                        <span className="font-semibold">{reply.user}</span>{" "}
                        {reply.content}
                      </p>
                      {reply.user_id === currentUserId && (
                        <button
                          onClick={() => onDeleteReply(reply.id)}
                          aria-label="Delete reply"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">
                      {reply.date_made}
                    </p>
                  </div>
                ))}

                {/* Reply form */}
                <form
                  onSubmit={(e) => handleReply(e, comment.id)}
                  className="flex items-center space-x-2"
                >
                  <Textarea
                    className="flex-1 h-12"
                    placeholder="Write a reply…"
                    value={replyContents[comment.id] || ""}
                    onChange={(e) =>
                      setReplyContents((prev) => ({
                        ...prev,
                        [comment.id]: e.target.value,
                      }))
                    }
                    required
                  />
                  <Button type="submit" size="sm">
                    Reply
                  </Button>
                </form>
              </div>
            ))}

            {/* New comment form */}
            <form
              onSubmit={handleComment}
              className="flex items-center space-x-2"
            >
              <Textarea
                className="flex-1 h-12"
                placeholder="Write a comment…"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                required
              />
              <Button type="submit" size="sm">
                Comment
              </Button>
            </form>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </article>
  );
}
