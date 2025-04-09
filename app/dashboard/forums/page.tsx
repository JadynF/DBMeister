'use client';

import React, { useState, useEffect } from 'react';
import authorization from '@/lib/authorization';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Search, Send, Flag, Trash2, Plus } from 'lucide-react';
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
  replies: Reply[];
};

type Reply = {
  id: number;
  user: string;
  content: string;
};

export default function ForumPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newHeader, setNewHeader] = useState('');
  const [newPost, setNewPost] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const userResponse = await authorization();
        setUserData(userResponse.userData);

        // Fetch posts from the backend API
        const postsResponse = await fetch('/api/forums');
        if (!postsResponse.ok) throw new Error('Failed to fetch posts');
        const postsData = await postsResponse.json();

        // Transform the fetched posts to match our Post type
        const mappedPosts = postsData.posts.map((post: any) => ({
          id: post.id,
          title: post.title,
          text: post.text,
          user: `User ${post.user_id}`,
          user_id: post.user_id,
          date_made: post.date_made,
          comments: [] // No comments from the API; handled locally
        }));

        setPosts(mappedPosts);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    })();
  }, []);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) return;

    try {
      const response = await fetch('/api/forums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userData.id,
          title: newHeader,
          text: newPost,
        }),
      });

      if (!response.ok) throw new Error('Failed to create post');

      const { response: creationResponse } = await response.json();
      console.log(creationResponse);

      // Since the API doesn't return the new post, we create a new post object locally
      const newPostData: Post = {
        id: Date.now(),
        title: newHeader,
        text: newPost,
        user: `${userData.firstName} ${userData.lastName}`,
        user_id: userData.id,
        date_made: new Date().toISOString().split('T')[0],
        comments: [],
      };

      setPosts([newPostData, ...posts]);
      setNewHeader('');
      setNewPost('');
      setIsCreatePostOpen(false);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleCommentSubmit = (postId: number, commentContent: string) => {
    if (!userData) return;
    const updatedPosts = posts.map((post) =>
      post.id === postId
        ? {
            ...post,
            comments: [
              ...post.comments,
              {
                id: Date.now(),
                user: `${userData.firstName} ${userData.lastName}`,
                content: commentContent,
                replies: [],
              },
            ],
          }
        : post
    );
    setPosts(updatedPosts);
  };

  const handleReplySubmit = (postId: number, commentId: number, replyContent: string) => {
    if (!userData) return;
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        const updatedComments = post.comments.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                replies: [
                  ...comment.replies,
                  {
                    id: Date.now(),
                    user: `${userData.firstName} ${userData.lastName}`,
                    content: replyContent,
                  },
                ],
              }
            : comment
        );
        return { ...post, comments: updatedComments };
      }
      return post;
    });
    setPosts(updatedPosts);
  };

  const handleDeletePost = async (postId: number) => {
    try {
      const response = await fetch('/api/forums', {
        method: 'DELETE',
        body: JSON.stringify({ id: postId }),
      });
      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleReportPost = (postId: number, explanation: string) => {
    console.log(`Post ${postId} reported with reason: ${explanation}`);
  };

  const filteredPosts = posts.filter((post) =>
    post.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-slate-700 dark:text-slate-300">Loading...</span>
      </div>
    );
  }

  return (
    <>
      {/* Modern Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center">
          <MessageSquare className="mr-3 h-8 w-8 text-blue-600 dark:text-blue-400" />
          Forum Discussions
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          Join conversations and share your thoughts with the community
        </p>
      </div>

      {/* Content Container */}
      <div className="bg-white dark:bg-slate-800 shadow-sm rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden p-6">
        <div className="flex flex-col">
          {/* Top Section with Search and Create Button */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="relative w-full md:w-64 lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
              <DialogTrigger asChild>
                <Button className="whitespace-nowrap" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  New Discussion
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Start a New Discussion</h2>
                <form onSubmit={handlePostSubmit} className="flex flex-col space-y-4">
                  <div>
                    <label htmlFor="post-title" className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Title</label>
                    <Input
                      id="post-title"
                      value={newHeader}
                      onChange={(e) => setNewHeader(e.target.value)}
                      placeholder="Enter a descriptive title"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="post-content" className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Content</label>
                    <Textarea
                      id="post-content"
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      placeholder="Share your thoughts with the community..."
                      required
                      className="min-h-[120px]"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" onClick={() => setIsCreatePostOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      Post Discussion
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* FAQ Section */}
          <div className="mb-6">
            <Accordion type="single" collapsible className="bg-slate-50 dark:bg-slate-700/30 rounded-lg">
              <AccordionItem value="faq" className="border-none">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <span className="text-base font-medium text-slate-800 dark:text-slate-200">Frequently Asked Questions</span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                    <li className="flex items-start">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 mr-2"></span>
                      <span><strong>Creating Posts:</strong> Click the "New Discussion" button to share your thoughts.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 mr-2"></span>
                      <span><strong>Commenting:</strong> You can leave comments on any post and reply to other comments.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 mr-2"></span>
                      <span><strong>Creating Diagrams:</strong> Visit the diagrams page to create and share visual explanations.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 mr-2"></span>
                      <span><strong>Excel Tables:</strong> You can add Excel tables to your canvas with all data included.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 mr-2"></span>
                      <span><strong>Reporting Content:</strong> Use the report feature to flag inappropriate content.</span>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Posts Grid */}
          <div className="space-y-4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onCommentSubmit={handleCommentSubmit}
                  onReplySubmit={handleReplySubmit}
                  onDeletePost={handleDeletePost}
                  onReportPost={handleReportPost}
                  currentUserId={userData.id}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                <MessageSquare className="h-12 w-12 text-slate-400 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No discussions found</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-4">
                  {searchQuery ? "No posts match your search criteria." : "Be the first to start a discussion!"}
                </p>
                {!searchQuery && (
                  <Button onClick={() => setIsCreatePostOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Start a Discussion
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

interface PostCardProps {
  post: Post;
  onCommentSubmit: (postId: number, commentContent: string) => void;
  onReplySubmit: (postId: number, commentId: number, replyContent: string) => void;
  onDeletePost: (postId: number) => void;
  onReportPost: (postId: number, explanation: string) => void;
  currentUserId: number;
}

const PostCard = ({ 
  post, 
  onCommentSubmit, 
  onReplySubmit, 
  onDeletePost, 
  onReportPost,
  currentUserId
}: PostCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  
  const isAuthor = post.user_id === currentUserId;
  
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md">
      {/* Post Header */}
      <div className="border-b border-slate-100 dark:border-slate-700 p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">{post.title}</h3>
            <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
              <span>{post.user}</span>
              <span className="mx-1">•</span>
              <span>{post.date_made}</span>
            </div>
          </div>
          
          <div className="flex space-x-1">
            {isAuthor && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={() => onDeletePost(post.id)}
              >
                <Trash2 className="h-4 w-4 text-slate-500 hover:text-red-500" />
                <span className="sr-only">Delete</span>
              </Button>
            )}
            
            <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Flag className="h-4 w-4 text-slate-500 hover:text-amber-500" />
                  <span className="sr-only">Report</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Report Post</h2>
                <Textarea
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Please explain why you're reporting this post..."
                  className="min-h-[100px] mb-4"
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsReportDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => {
                      onReportPost(post.id, reportReason);
                      setReportReason('');
                      setIsReportDialogOpen(false);
                    }}
                  >
                    Submit Report
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      
      {/* Post Content */}
      <div className="p-4">
        <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{post.text}</p>
      </div>
      
      {/* Comments Section */}
      <div className="border-t border-slate-100 dark:border-slate-700 p-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-4 text-slate-600 dark:text-slate-400"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {post.comments.length > 0 ? 
            `${isExpanded ? 'Hide' : 'Show'} ${post.comments.length} comment${post.comments.length !== 1 ? 's' : ''}` : 
            'No comments yet'
          }
        </Button>
        
        {isExpanded && (
          <div className="space-y-4 mt-2">
            {post.comments.map((comment) => (
              <CommentItem 
                key={comment.id}
                comment={comment}
                postId={post.id}
                onReplySubmit={onReplySubmit}
              />
            ))}
          </div>
        )}
        
        {/* Comment Form */}
        <div className="mt-4 flex items-start gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 text-xs font-medium uppercase">
            {currentUserId.toString().substring(0, 1)}
          </div>
          <div className="flex-1">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (commentContent.trim()) {
                  onCommentSubmit(post.id, commentContent);
                  setCommentContent('');
                  setIsExpanded(true);
                }
              }}
              className="flex gap-2"
            >
              <Input
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1"
              />
              <Button 
                type="submit" 
                size="sm"
                disabled={!commentContent.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

interface CommentItemProps {
  comment: Comment;
  postId: number;
  onReplySubmit: (postId: number, commentId: number, replyContent: string) => void;
}

const CommentItem = ({ comment, postId, onReplySubmit }: CommentItemProps) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  
  return (
    <div className="pl-4 border-l-2 border-slate-100 dark:border-slate-700">
      <div className="flex flex-col">
        <div className="mb-1">
          <span className="font-medium text-slate-900 dark:text-white">{comment.user}</span>
        </div>
        <p className="text-slate-700 dark:text-slate-300 text-sm">{comment.content}</p>
        
        <div className="mt-2 mb-1 flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-auto px-0 py-0 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white"
            onClick={() => setShowReplyForm(!showReplyForm)}
          >
            Reply
          </Button>
          
          {comment.replies.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-auto px-0 py-0 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white"
              onClick={() => setShowReplies(!showReplies)}
            >
              {`${showReplies ? 'Hide' : 'Show'} ${comment.replies.length} ${comment.replies.length === 1 ? 'reply' : 'replies'}`}
            </Button>
          )}
        </div>
        
        {/* Reply Form */}
        {showReplyForm && (
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (replyContent.trim()) {
                onReplySubmit(postId, comment.id, replyContent);
                setReplyContent('');
                setShowReplyForm(false);
                setShowReplies(true);
              }
            }}
            className="mb-3 mt-1 flex gap-2"
          >
            <Input
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              className="flex-1 text-sm"
              size={3}
            />
            <Button 
              type="submit" 
              size="sm"
              className="h-8"
              disabled={!replyContent.trim()}
            >
              <Send className="h-3 w-3" />
            </Button>
          </form>
        )}
        
        {/* Replies */}
        {showReplies && comment.replies.length > 0 && (
          <div className="mt-2 space-y-3 pl-4 border-l border-slate-100 dark:border-slate-700">
            {comment.replies.map((reply) => (
              <div key={reply.id} className="text-sm">
                <span className="font-medium text-slate-900 dark:text-white">{reply.user}</span>
                <p className="text-slate-700 dark:text-slate-300">{reply.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};