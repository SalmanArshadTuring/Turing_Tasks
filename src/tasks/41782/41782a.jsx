import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const initialPosts = [
  { id: 1, title: 'First Post', description: 'This is the first blog post.', category: 'Tech', approved: true },
  { id: 2, title: 'Second Post', description: 'Exploring new technologies.', category: 'Tech', approved: false },
];

export default function App() {
  const [posts, setPosts] = useState(initialPosts);
  const [isOpen, setIsOpen] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [newPost, setNewPost] = useState({ title: '', description: '', category: 'Tech' });

  const openModal = (post = null) => {
    setEditPost(post);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditPost(null);
    setNewPost({ title: '', description: '', category: 'Tech' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editPost) {
      setPosts(posts.map(p => p.id === editPost.id ? { ...editPost, ...newPost } : p));
    } else {
      setPosts([...posts, { ...newPost, id: Date.now(), approved: false }]);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    setPosts(posts.filter(p => p.id !== id));
  };

  const handleApproval = (id, approved) => {
    setPosts(posts.map(p => p.id === id ? { ...p, approved } : p));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Blog CMS</h1>
      <button onClick={() => openModal()} className="mb-4 p-2 bg-blue-500 text-white rounded">Add New Post</button>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {posts.map(post => (
          <Card key={post.id} className="mb-4">
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
              <CardDescription>{post.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{post.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <button onClick={() => openModal(post)} className="p-2 bg-yellow-500 text-white rounded">Edit</button>
              <button onClick={() => handleDelete(post.id)} className="p-2 bg-red-500 text-white rounded">Delete</button>
              <button 
                onClick={() => handleApproval(post.id, !post.approved)} 
                className={`p-2 ${post.approved ? 'bg-gray-300' : 'bg-green-500'} text-white rounded`}
              >
                {post.approved ? 'Unapprove' : 'Approve'}
              </button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editPost ? "Edit Post" : "New Post"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 items-center gap-1.5">
                <label htmlFor="title">Title</label>
                <input 
                  id="title" 
                  type="text" 
                  value={newPost.title} 
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} 
                  required 
                  className="p-2 border rounded"
                />
              </div>
              <div className="grid grid-cols-1 items-center gap-1.5">
                <label htmlFor="description">Description</label>
                <textarea 
                  id="description" 
                  value={newPost.description} 
                  onChange={(e) => setNewPost({ ...newPost, description: e.target.value })} 
                  required 
                  className="p-2 border rounded"
                />
              </div>
              <div className="grid grid-cols-1 items-center gap-1.5">
                <label htmlFor="category">Category</label>
                <select 
                  id="category" 
                  value={newPost.category} 
                  onChange={(e) => setNewPost({ ...newPost, category: e.target.value })} 
                  className="p-2 border rounded"
                >
                  <option value="Tech">Tech</option>
                  <option value="Life">Life</option>
                  <option value="Science">Science</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <button type="submit" className="p-2 bg-blue-500 text-white rounded">{editPost ? "Update" : "Create"}</button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
