'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import authorization from '@/lib/authorization';
import { Trash2, Flag, Send, MessageSquare } from 'lucide-react';

type UserData = {
  firstName: string;
  lastName: string;
};

export default function ForumPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState('');

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
    const post = {
      id: Date.now(),
      content: newPost,
      user: `${userData?.firstName} ${userData?.lastName}`,
      comments: [],
    };
    setPosts([post, ...posts]);
    setNewPost('');
  };

  const handleCommentSubmit = (postId: number, commentContent: string) => {
    const updatedPosts = posts.map((post) =>
      post.id === postId
        ? {
            ...post,
            comments: [
              ...post.comments,
              { id: Date.now(), content: commentContent, replies: [] },
            ],
          }
        : post
    );
    setPosts(updatedPosts);
  };

  const handleReplySubmit = (postId: number, commentId: number, replyContent: string) => {
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        const updatedComments = post.comments.map((comment: any) =>
          comment.id === commentId
            ? {
                ...comment,
                replies: [...comment.replies, { id: Date.now(), content: replyContent }],
              }
            : comment
        );
        return { ...post, comments: updatedComments };
      }
      return post;
    });
    setPosts(updatedPosts);
  };

  const handleReportPost = (postId: number) => {
    const explanation = prompt('Please provide an explanation for reporting this post:');
    if (explanation) {
      alert(`Post reported.\nReason: ${explanation}`);
    }
  };

  const handleDeletePost = (postId: number) => {
    if (confirm('Are you sure you want to delete this post?')) {
      setPosts(posts.filter((post) => post.id !== postId));
    }
  };

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen text-2xl font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-6 mb-6 rounded-lg shadow-lg"
      >
        <h1 className="text-4xl font-extrabold">Forums</h1>
      </motion.div>

      {/* New Post Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-6 rounded-lg shadow-lg mb-8"
      >
        <h2 className="text-2xl font-semibold mb-4">Create a New Post</h2>
        <form onSubmit={handlePostSubmit}>
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full flex items-center justify-center bg-blue-500 text-white py-3 rounded-lg mt-3 hover:bg-blue-600 transition duration-200"
          >
            <Send className="mr-2" /> Post
          </button>
        </form>
      </motion.div>

      {/* Posts */}
      <div className="space-y-6">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white shadow-lg rounded-lg p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <p className="text-lg font-semibold">{post.user}</p>
              <div className="flex space-x-3">
                <button onClick={() => handleReportPost(post.id)} className="text-sm text-red-500 hover:underline flex items-center">
                  <Flag className="w-4 h-4 mr-1" /> Report
                </button>
                <button onClick={() => handleDeletePost(post.id)} className="text-sm text-gray-500 hover:underline flex items-center">
                  <Trash2 className="w-4 h-4 mr-1" /> Delete
                </button>
              </div>
            </div>
            <p className="text-gray-800 mb-4">{post.content}</p>

            {/* Comment Section */}
            <CommentSection post={post} onCommentSubmit={handleCommentSubmit} onReplySubmit={handleReplySubmit} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Comment Section Component
const CommentSection = ({ post, onCommentSubmit, onReplySubmit }: any) => {
  const [commentContent, setCommentContent] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);

  return (
    <div className="mt-4">
      <form onSubmit={(e) => { e.preventDefault(); onCommentSubmit(post.id, commentContent); setCommentContent(''); }} className="mb-4">
        <textarea
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          placeholder="Write a comment..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button type="submit" className="w-full flex items-center justify-center bg-blue-500 text-white py-2 rounded-lg mt-2 hover:bg-blue-600 transition duration-200">
          <MessageSquare className="mr-2" /> Comment
        </button>
      </form>

      {post.comments.map((comment: any) => (
        <div key={comment.id} className="border-t pt-4">
          <p className="mb-2">{comment.content}</p>
          <button onClick={() => setActiveReplyId(activeReplyId === comment.id ? null : comment.id)} className="text-sm text-blue-500 hover:underline">
            {activeReplyId === comment.id ? 'Cancel Reply' : 'Reply'}
          </button>
          {activeReplyId === comment.id && (
            <form onSubmit={(e) => { e.preventDefault(); onReplySubmit(post.id, comment.id, replyContent); setReplyContent(''); setActiveReplyId(null); }} className="mt-2">
              <textarea className="w-full p-3 border border-gray-300 rounded-lg" value={replyContent} onChange={(e) => setReplyContent(e.target.value)} required />
              <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg mt-2 hover:bg-blue-600">
                Reply
              </button>
            </form>
          )}
        </div>
      ))}
    </div>
  );
};
