'use client';

import { useState, useEffect } from 'react';
import authorization from '@/lib/authorization';

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

  // Create a new post
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

  const handleReplySubmit = (
    postId: number,
    commentId: number,
    replyContent: string
  ) => {
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        const updatedComments = post.comments.map((comment: any) =>
          comment.id === commentId
            ? {
                ...comment,
                replies: [
                  ...comment.replies,
                  { id: Date.now(), content: replyContent },
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

  // Report a post with an explanation
  const handleReportPost = (postId: number) => {
    const explanation = prompt(
      'Please provide an explanation for reporting this post:'
    );
    if (explanation) {
      alert(`Post with ID ${postId} reported.\nExplanation: ${explanation}`);
    }
  };

  // Delete a post
  const handleDeletePost = (postId: number) => {
    if (confirm('Are you sure you want to delete this post?')) {
      setPosts(posts.filter((post) => post.id !== postId));
    }
  };

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-8">
        <div className="flex items-center justify-center w-full bg-[#bfdbfe] mb-6">
                <h1 className="m-4 text-3xl font-bold">Forums Page</h1>
        </div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Create a New Post</h2>
        <form onSubmit={handlePostSubmit}>
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full h-40 p-4 border border-gray-300 rounded-md mb-4"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-md mt-2 hover:bg-blue-600"
          >
            Post
          </button>
        </form>
      </div>


      <div className="space-y-8">
        {posts.map((post) => (
          <div key={post.id} className="bg-white shadow-lg rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <p className="text-lg font-semibold">{post.user}</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleReportPost(post.id)}
                  className="text-sm text-red-500 hover:underline"
                >
                  Report Post
                </button>
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="text-sm text-gray-500 hover:underline"
                >
                  Delete Post
                </button>
              </div>
            </div>
            <p className="text-gray-800 mb-4">{post.content}</p>

            <CommentSection
              post={post}
              onCommentSubmit={handleCommentSubmit}
              onReplySubmit={handleReplySubmit}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

type CommentSectionProps = {
  post: any;
  onCommentSubmit: (postId: number, commentContent: string) => void;
  onReplySubmit: (
    postId: number,
    commentId: number,
    replyContent: string
  ) => void;
};

const CommentSection: React.FC<CommentSectionProps> = ({
  post,
  onCommentSubmit,
  onReplySubmit,
}) => {
  const [commentContent, setCommentContent] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCommentSubmit(post.id, commentContent);
    setCommentContent('');
  };

  const handleReplySubmit = (e: React.FormEvent, commentId: number) => {
    e.preventDefault();
    onReplySubmit(post.id, commentId, replyContent);
    setReplyContent('');
    setActiveReplyId(null);
  };

  return (
    <div className="mt-4">
      {/* Comment Form */}
      <form onSubmit={handleCommentSubmit} className="mb-4">
        <textarea
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          placeholder="Write a comment..."
          className="w-full p-4 border border-gray-300 rounded-md"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-md mt-2 hover:bg-blue-600"
        >
          Comment
        </button>
      </form>

      {post.comments.map((comment: any) => (
        <div key={comment.id} className="border-t pt-4">
          <p className="mb-2">{comment.content}</p>
          <button
            onClick={() =>
              setActiveReplyId(activeReplyId === comment.id ? null : comment.id)
            }
            className="text-sm text-blue-500 mb-2 hover:underline"
          >
            {activeReplyId === comment.id ? 'Cancel Reply' : 'Reply'}
          </button>
          {activeReplyId === comment.id && (
            <form onSubmit={(e) => handleReplySubmit(e, comment.id)} className="mt-2">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="w-full p-4 border border-gray-300 rounded-md"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded-md mt-2 hover:bg-blue-600"
              >
                Reply
              </button>
            </form>
          )}
          {comment.replies.map((reply: any) => (
            <div key={reply.id} className="mt-2 pl-6 text-gray-600">
              <p>- {reply.content}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};