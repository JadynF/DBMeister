'use client'
import React, { useState } from "react";
import { Toaster } from "@/components/ui/sonner";

export default function ForumPage() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "First Post",
      content: "This is the content of the first post.",
      comments: [
        { id: 1, content: "First comment on this post" },
        { id: 2, content: "Second comment on this post" },
      ],
    },
    {
      id: 2,
      title: "Second Post",
      content: "This is the content of the second post.",
      comments: [{ id: 1, content: "First comment on this second post" }],
    },
  ]);

  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");

  const handleAddPost = () => {
    const newPost = {
      id: posts.length + 1,
      title: newPostTitle,
      content: newPostContent,
      comments: [],
    };
    setPosts([...posts, newPost]);
    setNewPostTitle("");
    setNewPostContent("");
  };

  const handleAddComment = (postId: number, commentContent: string) => {
    const updatedPosts = posts.map((post) =>
      post.id === postId
        ? {
            ...post,
            comments: [
              ...post.comments,
              { id: post.comments.length + 1, content: commentContent },
            ],
          }
        : post
    );
    setPosts(updatedPosts);
  };

  const handleDeletePost = (postId: number) => {
    const updatedPosts = posts.filter((post) => post.id !== postId);
    setPosts(updatedPosts);
  };

  const handleDeleteComment = (postId: number, commentId: number) => {
    const updatedPosts = posts.map((post) =>
      post.id === postId
        ? {
            ...post,
            comments: post.comments.filter((comment) => comment.id !== commentId),
          }
        : post
    );
    setPosts(updatedPosts);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Forum</h1>

        {/* Add new post form */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Create a New Post</h2>
          <input
            type="text"
            className="w-full p-3 mb-4 border rounded-lg"
            placeholder="Title"
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
          />
          <textarea
            className="w-full p-3 mb-4 border rounded-lg"
            placeholder="Content"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
          />
          <button
            onClick={handleAddPost}
            className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
          >
            Post
          </button>
        </div>

        {/* Forum Posts */}
        {posts.map((post) => (
          <div key={post.id} className="mb-6 p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold">{post.title}</h3>
            <p className="mt-4">{post.content}</p>

            {/* Comments */}
            <div className="mt-4">
              <h4 className="text-xl font-medium mb-2">Comments:</h4>
              {post.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex justify-between items-center bg-gray-100 p-4 mb-2 rounded-lg"
                >
                  <p>{comment.content}</p>
                  <button
                    onClick={() => handleDeleteComment(post.id, comment.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))}
              <input
                type="text"
                className="w-full p-2 mb-4 border rounded-lg"
                placeholder="Add a comment..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value.trim()) {
                    handleAddComment(post.id, e.currentTarget.value);
                    e.currentTarget.value = "";
                  }
                }}
              />
            </div>

            {/* Delete Post Button */}
            <button
              onClick={() => handleDeletePost(post.id)}
              className="mt-4 text-red-500 hover:text-red-700"
            >
              Delete Post
            </button>
          </div>
        ))}
      </div>

      {/* Toaster for notifications */}
      <Toaster />
    </div>
  );
}
