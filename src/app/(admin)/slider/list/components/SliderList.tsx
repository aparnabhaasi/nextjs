'use client';

import { useState, useEffect } from "react";
import { Button, Card, CardHeader, CardTitle, Col, Row, Modal, Form } from "react-bootstrap";
import Image from "next/image";

interface Slider {
  id: string;
  title: string;
  imageUrl: string;
}

const SliderList = () => {
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({ title: "", image: null as File | null });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [sliderList, setSliderList] = useState<Slider[]>([]);
  const [editSliderId, setEditSliderId] = useState<string | null>(null);

  // Fetch slider data
  useEffect(() => {
    const fetchSliderData = async () => {
      try {
        const response = await fetch('/api/slider');
        if (!response.ok) throw new Error("Failed to fetch sliders");
        const data = await response.json();
        setSliderList(data);
      } catch (error) {
        console.error("Error fetching slider data:", error);
      }
    };
    fetchSliderData();
  }, []);

  const resetForm = () => {
    setFormData({ title: "", image: null });
    setImagePreview(null);
    setEditSliderId(null);
    setIsEditMode(false);
  };

  const handleModalClose = () => {
    setShowModal(false);
    resetForm();
  };

  const handleModalShow = (slider?: Slider) => {
    if (slider) {
      // Edit mode
      setFormData({ title: slider.title, image: null });
      setImagePreview(slider.imageUrl);
      setEditSliderId(slider.id);
      setIsEditMode(true);
    } else {
      // Add mode
      resetForm();
    }
    setShowModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "image" && files) {
      const file = files[0];
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
    if (!formData.title || (!formData.image && !isEditMode)) {
      alert("Title and image are required!");
      return;
    }

    const apiEndpoint = isEditMode ? `/api/slider/${editSliderId}` : "/api/slider";
    const method = isEditMode ? "PUT" : "POST";

    const data = new FormData();
    data.append("title", formData.title);
    if (formData.image) data.append("image", formData.image);

    try {
      const response = await fetch(apiEndpoint, { method, body: data });
      if (!response.ok) throw new Error(await response.text());

      const updatedSliders = await fetch('/api/slider').then((res) => res.json());
      setSliderList(updatedSliders);
      handleModalClose();
    } catch (error) {
      console.error("Error saving slider:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this slider?")) return;

    try {
      const response = await fetch(`/api/slider/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete slider");

      const updatedSliders = await fetch('/api/slider').then((res) => res.json());
      setSliderList(updatedSliders);
    } catch (error) {
      console.error("Error deleting slider:", error);
    }
  };

  return (
    <Row>
      <Col xl={12}>
        <Card>
          <CardHeader className="d-flex justify-content-between align-items-center border-bottom">
            <CardTitle as="h4" className="mb-0">Sliders</CardTitle>
            <Button variant="outline-primary" onClick={() => handleModalShow()}>
              Add New Slider
            </Button>
          </CardHeader>
          <div className="table-responsive">
            <table className="table align-middle text-nowrap table-hover table-centered mb-0">
              <thead className="bg-light-subtle">
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Image</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sliderList.length > 0 ? (
                  sliderList.map((slider, index) => (
                    <tr key={slider.id}>
                      <td>{index + 1}</td>
                      <td>{slider.title}</td>
                      <td>
                        {slider.imageUrl && (
                          <Image
                            src={slider.imageUrl}
                            alt="Slider"
                            className="avatar-md rounded border border-light border-3"
                            width={100}
                            height={100}
                          />
                        )}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button variant="light" size="sm" onClick={() => handleModalShow(slider)}>Edit</Button>
                          <Button variant="soft-danger" size="sm" onClick={() => handleDelete(slider.id)}>Delete</Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4}>No sliders found.</td>
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
          <Modal.Title>{isEditMode ? "Edit Slider" : "Add Slider"}</Modal.Title>
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
                placeholder="Enter slider title"
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

export default SliderList;
