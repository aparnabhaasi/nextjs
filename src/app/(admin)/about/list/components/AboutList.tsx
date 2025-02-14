'use client';

import { useState, useEffect } from "react";
import { Button, Card, CardHeader, CardTitle, Col, Row, Modal, Form } from "react-bootstrap";
import Image from "next/image";

interface About {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

const AboutList = () => { // ✅ Component name in PascalCase
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", image: null as File | null });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [aboutData, setAboutData] = useState<About[]>([]);  // ✅ Renamed state variable
  const [editAboutId, setEditAboutId] = useState<string | null>(null);  // ✅ Renamed variable

  // Fetch about data
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await fetch('/api/about');
        if (!response.ok) throw new Error("Failed to fetch about data");
        const data = await response.json();
        setAboutData(data);
      } catch (error) {
        console.error("Error fetching about data:", error);
      }
    };
    fetchAboutData();
  }, []);

  const resetForm = () => {
    setFormData({ title: "", description: "", image: null });
    setImagePreview(null);
    setEditAboutId(null);
    setIsEditMode(false);
  };

  const handleModalClose = () => {
    setShowModal(false);
    resetForm();
  };

  const handleModalShow = (about?: About) => {
    if (about) {
      // Edit mode
      setFormData({ title: about.title, description: about.description, image: null });
      setImagePreview(about.imageUrl);
      setEditAboutId(about.id);
      setIsEditMode(true);
    } else {
      // Add mode
      resetForm();
    }
    setShowModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "image") {
      const inputElement = e.target as HTMLInputElement;
      if (inputElement.files && inputElement.files.length > 0) {
        const file = inputElement.files[0];
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);
        setFormData((prev) => ({ ...prev, image: file }));
      }
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

    const apiEndpoint = isEditMode ? `/api/about/${editAboutId}` : "/api/about";
    const method = isEditMode ? "PUT" : "POST";

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    if (formData.image) data.append("image", formData.image);

    try {
      const response = await fetch(apiEndpoint, { method, body: data });
      if (!response.ok) throw new Error(await response.text());

      const updatedAbouts = await fetch('/api/about').then((res) => res.json());
      setAboutData(updatedAbouts);
      handleModalClose();
    } catch (error) {
      console.error("Error saving about:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this about?")) return;

    try {
      const response = await fetch(`/api/about/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete about");

      const updatedAbouts = await fetch('/api/about').then((res) => res.json());
      setAboutData(updatedAbouts);
    } catch (error) {
      console.error("Error deleting about:", error);
    }
  };

  return (
    <Row>
      <Col xl={12}>
        <Card>
          <CardHeader className="d-flex justify-content-between align-items-center border-bottom">
            <CardTitle as="h4" className="mb-0">Abouts</CardTitle>
            <Button variant="outline-primary" onClick={() => handleModalShow()}>
              Add New About
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
                {aboutData.length > 0 ? (
                  aboutData.map((about, index) => (
                    <tr key={about.id}>
                      <td>{index + 1}</td>
                      <td>{about.title}</td>
                      <td>{about.description}</td>
                      <td>
                        {about.imageUrl && (
                          <Image
                            src={about.imageUrl}
                            alt="About"
                            className="avatar-md rounded border border-light border-3"
                            width={100}
                            height={100}
                          />
                        )}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button variant="light" size="sm" onClick={() => handleModalShow(about)}>Edit</Button>
                          <Button variant="soft-danger" size="sm" onClick={() => handleDelete(about.id)}>Delete</Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5}>No abouts found.</td>
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
          <Modal.Title>{isEditMode ? "Edit About" : "Add About"}</Modal.Title>
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
                placeholder="Enter about title"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter about description"
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

export default AboutList;
