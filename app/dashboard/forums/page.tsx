'use client';

import React, { useState, useEffect } from 'react';
import authorization from '@/lib/authorization';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { MessageSquare, Search, Plus } from 'lucide-react';
import PostCard from './PostCard';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

type UserData = {
  id: number;
  firstName: string;
  lastName: string;
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

type Comment = {
  id: number;
  user: string;
  content: string;
  user_id: number;
  date_made: string;
  replies: Reply[];
};

type Reply = {
  id: number;
  user: string;
  content: string;
  user_id: number;
  date_made: string;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export default function ForumPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newHeader, setNewHeader] = useState('');
  const [newPost, setNewPost] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const postsResponse = await fetch('/api/forums');
      const { posts: postsData } = await postsResponse.json();

      const formattedPosts = postsData.map((post: Post) => ({
        ...post,
        date_made: formatDate(post.date_made),
        comments: post.comments.map((comment: Comment) => ({
          ...comment,
          date_made: formatDate(comment.date_made),
          replies: comment.replies.map((reply: Reply) => ({
            ...reply,
            date_made: formatDate(reply.date_made)
          }))
        }))
      }));

      setPosts(formattedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        const userResponse = await authorization();
        setUserData(userResponse.userData);
        await fetchPosts();
      } catch (error) {
        console.error('Error initializing:', error);
      }
    };

    initialize();
  }, []);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) return;

    try {
      await fetch('/api/forums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'post',
          userId: userData.id,
          title: newHeader,
          text: newPost
        }),
      });

      setNewHeader('');
      setNewPost('');
      setIsCreatePostOpen(false);
      await fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleCommentSubmit = async (postId: number, content: string) => {
    if (!userData) return;

    try {
      await fetch('/api/forums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'comment',
          postId,
          userId: userData.id,
          content
        }),
      });

      await fetchPosts();
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const handleReplySubmit = async (postId: number, commentId: number, content: string) => {
    if (!userData) return;

    try {
      await fetch('/api/forums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'reply',
          postId,
          commentId,
          userId: userData.id,
          content
        }),
      });

      await fetchPosts();
    } catch (error) {
      console.error('Error creating reply:', error);
    }
  };

  const handleDeletePost = async (postId: number) => {
    try {
      await fetch('/api/forums', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'post', id: postId }),
      });

      await fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await fetch('/api/forums', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'comment', id: commentId }),
      });

      await fetchPosts();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleDeleteReply = async (replyId: number) => {
    try {
      await fetch('/api/forums', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'reply', id: replyId }),
      });

      await fetchPosts();
    } catch (error) {
      console.error('Error deleting reply:', error);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!userData || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-10 w-10 rounded-full border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <MessageSquare className="h-8 w-8 text-blue-600" />
          Forum Discussions
        </h1>
      </div>

      {/* FAQ */}
      <div className="mb-8">
        <Accordion type="single" collapsible className="rounded-lg bg-slate-50 dark:bg-slate-800">
          <AccordionItem value="faq">
            <AccordionTrigger className="px-4 py-2 font-semibold text-lg">
              Frequently Asked Questions
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 space-y-2 text-slate-700 dark:text-slate-300">
              <p>• Create discussions easily by clicking "New Discussion".</p>
              <p>• Add comments or reply to others in any post.</p>
              <p>• Report inappropriate behavior by clicking "Report".</p>
              <p>• Use diagrams and tables to illustrate complex ideas!</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Search and Create Post */}
      <div className="flex justify-between mb-6">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search discussions..."
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
            <form onSubmit={handlePostSubmit} className="flex flex-col gap-4">
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

      {/* Posts */}
      <div className="space-y-6">
        {filteredPosts.map(post => (
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
