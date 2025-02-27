'use client';

import { useState, useEffect } from 'react';
import authorization from '@/lib/authorization';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
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
  const [newHeader, setNewHeader] = useState(''); // New state for header input
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

        // Transform the fetched posts to match our Post type.
        const mappedPosts = postsData.posts.map((post: any) => ({
          id: post.id,
          title: post.title,
          text: post.text,
          // Here we simply display "User [id]". You can adjust this when you have full user info.
          user: `User ${post.user_id}`,
          date_made: post.date_made,
          comments: [] // No comments from the API; handled locally.
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
          title: newHeader, // Use the provided header
          text: newPost,
        }),
      });

      if (!response.ok) throw new Error('Failed to create post');

      const { response: creationResponse } = await response.json();
      console.log(creationResponse);

      // Since the API doesn't return the new post, we create a new post object locally.
      const newPostData: Post = {
        id: Date.now(),
        title: newHeader,
        text: newPost,
        user: `${userData.firstName} ${userData.lastName}`,
        date_made: new Date().toISOString().split('T')[0],
        comments: [],
      };

      setPosts([newPostData, ...posts]);
      setNewHeader(''); // Reset header
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
    post.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 bg-gray-50 min-h-screen">
      {/* Forum Header */}
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-800">My Forum</h1>
        <p className="text-lg text-gray-600">Join the conversation and share your thoughts</p>
      </header>

      {/* FAQ Section */}
      <div className="mb-8 bg-white shadow rounded-lg p-4">
        <Accordion type="single" collapsible>
          <AccordionItem value="faq">
            <AccordionTrigger className="text-xl font-semibold">
              Frequently Asked Questions (FAQ)
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-5">
                <li>
                  <strong>How do I create a post?</strong> Click the "Create New Post" button and share your thoughts!
                </li>
                <li>
                  <strong>How can I comment on a post?</strong> Simply type your comment below a post and hit "Comment".
                </li>
                <li>
                  <strong>How do I create a diagram?</strong> Go to the diagrams page and simply add a diagram.
                </li>
                <li>
                  <strong>Can I see add an excel table to my canvas?</strong> Yes, you can add an excel table to your canvas, including all the data.
                </li>
                <li>
                  <strong>How can I report inappropriate content?</strong> Click "Report" and provide a reason for reporting.
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border rounded"
        />
      </div>

      {/* Create Post Dialog */}
      <div className="mb-8">
        <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
          <DialogTrigger asChild>
            <Button className="mb-4">Create New Post</Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handlePostSubmit} className="flex flex-col space-y-4">
              <Input
                value={newHeader}
                onChange={(e) => setNewHeader(e.target.value)}
                placeholder="Enter post header..."
                required
                className="p-3 border rounded"
              />
              <Textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's on your mind?"
                required
                className="p-3 border rounded"
              />
              <Button type="submit" className="w-full">
                Post
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Posts */}
      <div className="space-y-6">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="bg-white shadow rounded-lg">
            <CardHeader className="relative p-4 border-b">
              <div className="flex justify-center">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800">{post.title}</h2>
                  <p className="text-sm text-gray-600">
                    Posted by {post.user} on {post.date_made}
                  </p>
                </div>
              </div>
              <div className="absolute top-2 right-2 flex space-x-2">
                <span
                  className="text-red-500 cursor-pointer hover:underline"
                  onClick={() => handleDeletePost(post.id)}
                >
                  Delete
                </span>
                <ReportDialog postId={post.id} onReport={handleReportPost} />
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-gray-700">{post.text}</p>
              <CommentSection
                post={post}
                onCommentSubmit={handleCommentSubmit}
                onReplySubmit={handleReplySubmit}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

const CommentSection = ({
  post,
  onCommentSubmit,
  onReplySubmit,
}: {
  post: Post;
  onCommentSubmit: (postId: number, commentContent: string) => void;
  onReplySubmit: (postId: number, commentId: number, replyContent: string) => void;
}) => {
  const [commentContent, setCommentContent] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);

  return (
    <div className="mt-4 border-t pt-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onCommentSubmit(post.id, commentContent);
          setCommentContent('');
        }}
        className="mb-4"
      >
        <Textarea
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          placeholder="Write a comment..."
          required
          className="w-full p-2 border rounded"
        />
        <Button type="submit" className="mt-2">
          Comment
        </Button>
      </form>

      {post.comments.map((comment) => (
        <div key={comment.id} className="mb-4">
          <p className="font-semibold text-gray-800">{comment.user}</p>
          <p className="text-gray-700">{comment.content}</p>

          {comment.replies.map((reply) => (
            <div key={reply.id} className="ml-6 mt-2 border-l pl-4">
              <p className="font-semibold text-gray-800">{reply.user}</p>
              <p className="text-gray-700">{reply.content}</p>
            </div>
          ))}

          {/* Reply Form */}
          <div className="mt-2">
            {activeReplyId === comment.id ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onReplySubmit(post.id, comment.id, replyContent);
                  setReplyContent('');
                  setActiveReplyId(null);
                }}
                className="flex flex-col space-y-2"
              >
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  required
                  className="w-full p-2 border rounded"
                />
                <div className="flex space-x-2">
                  <Button type="submit">Submit Reply</Button>
                  <Button variant="outline" onClick={() => setActiveReplyId(null)}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <span
                className="text-blue-500 cursor-pointer hover:underline"
                onClick={() => setActiveReplyId(comment.id)}
              >
                Reply
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const ReportDialog = ({
  postId,
  onReport,
}: {
  postId: number;
  onReport: (postId: number, explanation: string) => void;
}) => {
  const [explanation, setExplanation] = useState('');

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="text-blue-500 cursor-pointer hover:underline">Report</span>
      </DialogTrigger>
      <DialogContent>
        <Textarea
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          placeholder="Explain reason..."
          className="w-full p-2 border rounded"
        />
        <Button onClick={() => onReport(postId, explanation)} className="mt-2">
          Submit Report
        </Button>
      </DialogContent>
    </Dialog>
  );
};