'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Trash2 } from 'lucide-react';

type Reply = {
  id: number;
  user: string;
  content: string;
  user_id: number;
};

type Comment = {
  id: number;
  user: string;
  content: string;
  user_id: number;
  replies: Reply[];
};

interface CommentItemProps {
  comment: Comment;
  postId: number;
  currentUserId: number;
  onReplySubmit: (postId: number, commentId: number, replyContent: string) => void;
  onDeleteComment: (commentId: number) => void;
  onDeleteReply: (replyId: number) => void;
}

export default function CommentItem({
  comment,
  postId,
  currentUserId,
  onReplySubmit,
  onDeleteComment,
  onDeleteReply,
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyContent.trim()) {
      onReplySubmit(postId, comment.id, replyContent);
      setReplyContent('');
      setShowReplyForm(false);
      setShowReplies(true);
    }
  };

  return (
    <div className="pl-4 border-l-2 border-slate-200 dark:border-slate-700 space-y-2">
      <div>
        <div className="flex justify-between">
          <div className="font-semibold">{comment.user}</div>
          {comment.user_id === currentUserId && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onDeleteComment(comment.id)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          )}
        </div>
        <p className="text-sm text-slate-700 dark:text-slate-300">{comment.content}</p>
      </div>

      <div className="flex items-center gap-4">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          {showReplyForm ? 'Cancel' : 'Reply'}
        </Button>

        {comment.replies.length > 0 && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowReplies(!showReplies)}
            className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            {showReplies ? 'Hide Replies' : `Show ${comment.replies.length} ${comment.replies.length === 1 ? 'Reply' : 'Replies'}`}
          </Button>
        )}
      </div>

      {/* Reply Form */}
      {showReplyForm && (
        <form onSubmit={handleReplySubmit} className="flex gap-2 mt-2">
          <Input
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            className="text-sm"
          />
          <Button type="submit" size="sm" disabled={!replyContent.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      )}

      {/* Replies */}
      {showReplies && comment.replies.length > 0 && (
        <div className="pl-4 border-l border-slate-200 dark:border-slate-700 space-y-2 mt-2">
          {comment.replies.map((reply) => (
            <div key={reply.id}>
              <div className="flex justify-between">
                <div className="font-semibold">{reply.user}</div>
                {reply.user_id === currentUserId && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onDeleteReply(reply.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300">{reply.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
