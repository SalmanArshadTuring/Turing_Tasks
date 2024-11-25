import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const categories = ["Technology", "Travel", "Food", "Lifestyle"];

const BlogPostCard = ({ post, onEdit, onDelete, onApprove, isAdmin }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>{post.title}</CardTitle>
      <CardDescription>{post.category}</CardDescription>
    </CardHeader>
    <CardContent>
      <p>{post.description}</p>
    </CardContent>
    <CardFooter className="flex justify-between">
      <Button variant="outline" onClick={() => onEdit(post)}>Edit</Button>
      <Button variant="destructive" onClick={() => onDelete(post.id)}>Delete</Button>
      {isAdmin && !post.approved && (
        <Button variant="default" onClick={() => onApprove(post.id)}>Approve</Button>
      )}
    </CardFooter>
  </Card>
);

const BlogPostForm = ({ post, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(post?.title || "");
  const [description, setDescription] = useState(post?.description || "");
  const [category, setCategory] = useState(post?.category || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ id: post?.id, title, description, category, approved: post?.approved || false });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory} required>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
};

export default function App() {
  const [posts, setPosts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);

  useEffect(() => {
    // Simulating fetching posts from an API
    const fetchedPosts = [
      { id: 1, title: "First Post", description: "This is the first post.", category: "Technology", approved: true },
      { id: 2, title: "Second Post", description: "This is the second post.", category: "Travel", approved: false },
    ];
    setPosts(fetchedPosts);
  }, []);

  const handleAddPost = (newPost) => {
    setPosts([...posts, { ...newPost, id: Date.now() }]);
    setIsDialogOpen(false);
  };

  const handleEditPost = (updatedPost) => {
    setPosts(posts.map((post) => (post.id === updatedPost.id ? updatedPost : post)));
    setIsDialogOpen(false);
  };

  const handleDeletePost = (id) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  const handleApprovePost = (id) => {
    setPosts(posts.map((post) => (post.id === id ? { ...post, approved: true } : post)));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Blog CMS</h1>
        <div className="flex items-center space-x-2">
          <Label htmlFor="admin-mode">Admin Mode</Label>
          <Switch
            id="admin-mode"
            checked={isAdmin}
            onCheckedChange={setIsAdmin}
          />
        </div>
      </div>
      <Button onClick={() => setIsDialogOpen(true)} className="mb-4">Add New Post</Button>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {posts
          .filter((post) => isAdmin || post.approved)
          .map((post) => (
            <BlogPostCard
              key={post.id}
              post={post}
              onEdit={(post) => {
                setCurrentPost(post);
                setIsDialogOpen(true);
              }}
              onDelete={handleDeletePost}
              onApprove={handleApprovePost}
              isAdmin={isAdmin}
            />
          ))}
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentPost ? "Edit Post" : "Add New Post"}</DialogTitle>
          </DialogHeader>
          <BlogPostForm
            post={currentPost}
            onSubmit={(post) => currentPost ? handleEditPost(post) : handleAddPost(post)}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}