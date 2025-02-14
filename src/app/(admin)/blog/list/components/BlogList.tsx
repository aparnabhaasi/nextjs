'use client';

import { useState, useEffect } from "react";
import { Button, Card, CardHeader, CardTitle, Col, Row, Modal, Form } from "react-bootstrap";
import Image from "next/image";

interface Blog {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

const BlogList = () => {
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", image: null as File | null });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [blogList, setBlogList] = useState<Blog[]>([]);
  const [editBlogId, setEditBlogId] = useState<string | null>(null);

  // Fetch blog data
  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const response = await fetch('/api/blog');
        if (!response.ok) throw new Error("Failed to fetch blogs");
        const data = await response.json();
        setBlogList(data);
      } catch (error) {
        console.error("Error fetching blog data:", error);
      }
    };
    fetchBlogData();
  }, []);

  const resetForm = () => {
    setFormData({ title: "", description: "", image: null });
    setImagePreview(null);
    setEditBlogId(null);
    setIsEditMode(false);
  };

  const handleModalClose = () => {
    setShowModal(false);
    resetForm();
  };

  const handleModalShow = (blog?: Blog) => {
    if (blog) {
      // Edit mode
      setFormData({ title: blog.title, description: blog.description, image: null });
      setImagePreview(blog.imageUrl);
      setEditBlogId(blog.id);
      setIsEditMode(true);
    } else {
      // Add mode
      resetForm();
    }
    setShowModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
  
    if (name === "image" && e.target instanceof HTMLInputElement && e.target.files) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
      setFormData((prev) => ({ ...prev, image: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || (!formData.image && !isEditMode)) {
      alert("Title, description, and image are required!");
      return;
    }

    const apiEndpoint = isEditMode ? `/api/blog/${editBlogId}` : "/api/blog";
    const method = isEditMode ? "PUT" : "POST";

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    if (formData.image) data.append("image", formData.image);

    try {
      const response = await fetch(apiEndpoint, { method, body: data });
      if (!response.ok) throw new Error(await response.text());

      const updatedBlogs = await fetch('/api/blog').then((res) => res.json());
      setBlogList(updatedBlogs);
      handleModalClose();
    } catch (error) {
      console.error("Error saving blog:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      const response = await fetch(`/api/blog/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete blog");

      const updatedBlogs = await fetch('/api/blog').then((res) => res.json());
      setBlogList(updatedBlogs);
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  return (
    <Row>
      <Col xl={12}>
        <Card>
          <CardHeader className="d-flex justify-content-between align-items-center border-bottom">
            <CardTitle as="h4" className="mb-0">Blogs</CardTitle>
            <Button variant="outline-primary" onClick={() => handleModalShow()}>
              Add New Blog
            </Button>
          </CardHeader>
          <div className="table-responsive">
            <table className="table align-middle text-nowrap table-hover table-centered mb-0">
              <thead className="bg-light-subtle">
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Image</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {blogList.length > 0 ? (
                  blogList.map((blog, index) => (
                    <tr key={blog.id}>
                      <td>{index + 1}</td>
                      <td>{blog.title}</td>
                      <td>{blog.description}</td>
                      <td>
                        {blog.imageUrl && (
                          <Image
                            src={blog.imageUrl}
                            alt="blog"
                            className="avatar-md rounded border border-light border-3"
                            width={100}
                            height={100}
                          />
                        )}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button variant="light" size="sm" onClick={() => handleModalShow(blog)}>Edit</Button>
                          <Button variant="soft-danger" size="sm" onClick={() => handleDelete(blog.id)}>Delete</Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5}>No blogs found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </Col>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditMode ? "Edit Blog" : "Add Blog"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter blog title"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter blog description"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                onChange={handleInputChange}
              />
              {imagePreview && (
                <div className="mt-3">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={100}
                    height={100}
                  />
                </div>
              )}
            </Form.Group>

            <Button variant="primary" type="submit">
              {isEditMode ? "Save Changes" : "Save"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Row>
  );
};

export default BlogList;
