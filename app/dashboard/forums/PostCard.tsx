'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Trash2 } from 'lucide-react';
import CommentItem from './CommentItem';

type Post = {
  id: number;
  title: string;
  text: string;
  user: string;
  user_id: number;
  date_made: string;
  comments: Comment[];
};

type Comment = {
  id: number;
  user: string;
  content: string;
  user_id: number;
  replies: Reply[];
};

type Reply = {
  id: number;
  user: string;
  content: string;
  user_id: number;
};

interface PostCardProps {
  post: Post;
  onCommentSubmit: (postId: number, commentContent: string) => void;
  onReplySubmit: (postId: number, commentId: number, replyContent: string) => void;
  onDeletePost: (postId: number) => void;
  onDeleteComment: (commentId: number) => void;
  onDeleteReply: (replyId: number) => void;
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [commentContent, setCommentContent] = useState('');

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentContent.trim()) {
      onCommentSubmit(post.id, commentContent);
      setCommentContent('');
      setIsExpanded(true);
    }
  };

  return (
    <div className="border rounded-lg p-4 dark:bg-slate-800 bg-white">
      <div className="flex justify-between mb-2">
        <div>
          <h2 className="text-xl font-semibold">{post.title}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {post.user} • {post.date_made}
          </p>
        </div>
        {post.user_id === currentUserId && (
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onDeletePost(post.id)}
          >
            <Trash2 className="h-5 w-5 text-red-500" />
          </Button>
        )}
      </div>

      <div className="mb-4 text-slate-700 dark:text-slate-300">
        {post.text}
      </div>

      <div className="border-t pt-4">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="mb-4 text-slate-600 dark:text-slate-400"
        >
          {isExpanded ? 'Hide Comments' : 'Show Comments'}
        </Button>

        {isExpanded && (
          <div className="space-y-4 mb-4">
            {post.comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                postId={post.id}
                currentUserId={currentUserId}
                onReplySubmit={onReplySubmit}
                onDeleteComment={onDeleteComment}
                onDeleteReply={onDeleteReply}
              />
            ))}
          </div>
        )}

        {/* Comment form */}
        <form onSubmit={handleSubmitComment} className="flex gap-2">
          <Input
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="Write a comment..."
          />
          <Button type="submit" size="sm" disabled={!commentContent.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
