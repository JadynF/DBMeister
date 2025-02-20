'use client';

import { useState, useEffect } from 'react';
import authorization from '@/lib/authorization';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

type UserData = {
  firstName: string;
  lastName: string;
};

type Post = {
  id: number;
  content: string;
  user: string;
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
  const [newPost, setNewPost] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await authorization();
        setUserData(response.userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    })();
  }, []);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) return;

    const post: Post = {
      id: Date.now(),
      content: newPost,
      user: `${userData.firstName} ${userData.lastName}`,
      comments: [],
    };
    setPosts([post, ...posts]);
    setNewPost('');
    // Close the create post dialog after posting
    setIsCreatePostOpen(false);
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

  const handleDeletePost = (postId: number) => {
    setPosts(posts.filter((post) => post.id !== postId));
  };

  const handleReportPost = (postId: number, explanation: string) => {
    console.log(`Post ${postId} reported with reason: ${explanation}`);
  };

  const filteredPosts = posts.filter((post) =>
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-8">
      {/* Header */}
      <div className="flex items-center justify-center w-full bg-[#bfdbfe] mb-6 p-4 rounded-md">
        <h1 className="text-3xl font-bold">Forums Page</h1>
      </div>

      {/* FAQ Section */}
      <Accordion type="single" collapsible>
        <AccordionItem value="faq">
          <AccordionTrigger>Frequently Asked Questions (FAQ)</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-5">
              <li>
                <strong>How do I create a post?</strong> Click the "Create New Post" button and share your thoughts!
              </li>
              <li>
                <strong>How can I comment on a post?</strong> Simply type your comment below a post and hit "Comment".
              </li>
              <li>
                <strong>How do I reply to a comment?</strong> Click "Reply" to respond to a comment.
              </li>
              <li>
                <strong>Can I delete my post?</strong> Yes, click "Delete" on your post to remove it.
              </li>
              <li>
                <strong>How can I report inappropriate content?</strong> Click "Report" and provide a reason for reporting.
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Search Bar */}
      <Input
        type="text"
        placeholder="Search posts..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mt-4 mb-6"
      />

      {/* Create Post Dialog */}
      <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4" onClick={() => setIsCreatePostOpen(true)}>
            Create New Post
          </Button>
        </DialogTrigger>
        <DialogContent>
          <form onSubmit={handlePostSubmit}>
            <Textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="What's on your mind?"
              required
            />
            <Button type="submit" className="w-full mt-2">
              Post
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Posts */}
      <div className="space-y-8">
        {filteredPosts.map((post) => (
          <Card key={post.id}>
            <CardHeader className="flex justify-between items-center">
              <p className="text-lg font-semibold">{post.user}</p>
              <div className="flex space-x-4">
                <span
                  className="text-red-500 cursor-pointer hover:underline"
                  onClick={() => handleDeletePost(post.id)}
                >
                  Delete
                </span>
                <ReportDialog postId={post.id} onReport={handleReportPost} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-800">{post.content}</p>
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
    <div className="mt-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onCommentSubmit(post.id, commentContent);
          setCommentContent('');
        }}
      >
        <Textarea
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          placeholder="Write a comment..."
          required
        />
        <Button type="submit" className="mt-2 w-full">
          Comment
        </Button>
      </form>

      {post.comments.map((comment) => (
        <div key={comment.id} className="border-t pt-4">
          <p className="font-semibold">{comment.user}</p>
          <p>{comment.content}</p>

          {comment.replies.map((reply) => (
            <div key={reply.id} className="ml-6 mt-2 text-gray-600">
              <p className="font-semibold">{reply.user}</p>
              <p>{reply.content}</p>
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
              >
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  required
                />
                <Button type="submit" className="mt-2">
                  Submit Reply
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setActiveReplyId(null)}
                  className="mt-2 ml-2"
                >
                  Cancel
                </Button>
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
        />
        <Button onClick={() => onReport(postId, explanation)} className="mt-2">
          Submit Report
        </Button>
      </DialogContent>
    </Dialog>
  );
};
