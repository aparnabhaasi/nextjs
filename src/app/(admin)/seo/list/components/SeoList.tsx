"use client"; // This line makes the component a client-side component

import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { useEffect, useState } from "react";
import { Button, Card, CardFooter, CardHeader, CardTitle, Col, Row, Modal, Form } from "react-bootstrap";
import Link from "next/link";

// Define the expected structure of the SEO data (TypeScript)
type SeoEntry = {
  id: number;
  page: string;
  title: string;
  description: string;
  createdAt?: string; // Optional field for timestamp
};

const SeoList = () => {
  const [seoList, setSeoList] = useState<SeoEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // For modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false); // State for Create Modal
  const [editSeo, setEditSeo] = useState<SeoEntry | null>(null);

  // For Create New SEO Entry
  const [newSeo, setNewSeo] = useState<SeoEntry>({
    id: 0,
    page: '',
    title: '',
    description: '',
  });

  // Fetch data on component mount
  useEffect(() => {
    const fetchSeoData = async () => {
      try {
        const response = await fetch("/api/seo");
        const data: SeoEntry[] = await response.json();
        setSeoList(data);
      } catch (error) {
        console.error("Error fetching SEO data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeoData();
  }, []);

  // Handle deletion of an SEO entry
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/seo/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSeoList((prevList) => prevList.filter((item) => item.id !== id));
      } else {
        console.error("Failed to delete SEO entry");
      }
    } catch (error) {
      console.error("Error deleting SEO entry:", error);
    }
  };

  // Handle opening the edit modal
  const handleEdit = (entry: SeoEntry) => {
    setEditSeo(entry);
    setShowEditModal(true);
  };

  // Handle updating an SEO entry
  const handleUpdate = async () => {
    if (editSeo) {
      try {
        const response = await fetch(`/api/seo/${editSeo.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editSeo),
        });

        if (response.ok) {
          setSeoList((prevList) =>
            prevList.map((item) => (item.id === editSeo.id ? editSeo : item))
          );
          setShowEditModal(false);
        } else {
          console.error("Failed to update SEO entry");
        }
      } catch (error) {
        console.error("Error updating SEO entry:", error);
      }
    }
  };

  // Handle opening the create modal
  const handleCreate = () => {
    setNewSeo({ id: 0, page: '', title: '', description: '' }); // Reset newSeo state
    setShowCreateModal(true);
  };

  // Handle creating a new SEO entry
  const handleSaveNewSeo = async () => {
    try {
      const response = await fetch("/api/seo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSeo),
      });

      if (response.ok) {
        const createdSeo = await response.json();
        setSeoList((prevList) => [...prevList, createdSeo]);
        setShowCreateModal(false);
      } else {
        console.error("Failed to create SEO entry");
      }
    } catch (error) {
      console.error("Error creating SEO entry:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Row>
      <Col xl={12}>
        {/* Always show the New SEO Entry button, independent of SEO list state */}
        <div className="d-flex justify-content-end mb-3">
          <Button variant="primary" onClick={handleCreate}>
            New SEO Entry{" "}
            <IconifyIcon className="ms-1" width={16} height={16} icon="ri:arrow-down-s-line" />
          </Button>
        </div>

        <Card>
          <CardHeader className="d-flex justify-content-between align-items-center border-bottom">
            <div>
              <CardTitle as="h4" className="mb-0">
                SEO List
              </CardTitle>
            </div>
          </CardHeader>

          {/* Table to display SEO entries */}
          <div className="table-responsive">
            <table className="table align-middle text-nowrap table-hover table-centered mb-0">
              <thead className="bg-light-subtle">
                <tr>
                  <th>#</th>
                  <th>Page</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {seoList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center">No SEO entries found.</td>
                  </tr>
                ) : (
                  seoList.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.page}</td>
                      <td>{item.title}</td>
                      <td>{item.description}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button
                            variant="soft-primary"
                            size="sm"
                            onClick={() => handleEdit(item)} // Open modal for edit
                          >
                            <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-18" />
                          </Button>
                          <Button
                            variant="soft-danger"
                            size="sm"
                            onClick={() => handleDelete(item.id)} // Pass the correct ID
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <CardFooter>{/* Pagination can be added here */}</CardFooter>
        </Card>
      </Col>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit SEO Entry</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editSeo && (
            <Form>
              <Form.Group controlId="formPage">
                <Form.Label>Page</Form.Label>
                <Form.Control
                  type="text"
                  value={editSeo.page}
                  onChange={(e) => setEditSeo({ ...editSeo, page: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formTitle" className="mt-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={editSeo.title}
                  onChange={(e) => setEditSeo({ ...editSeo, title: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formDescription" className="mt-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editSeo.description}
                  onChange={(e) => setEditSeo({ ...editSeo, description: e.target.value })}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Create Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New SEO Entry</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formPage">
              <Form.Label>Page</Form.Label>
              <Form.Control
                type="text"
                value={newSeo.page}
                onChange={(e) => setNewSeo({ ...newSeo, page: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formTitle" className="mt-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={newSeo.title}
                onChange={(e) => setNewSeo({ ...newSeo, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formDescription" className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newSeo.description}
                onChange={(e) => setNewSeo({ ...newSeo, description: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveNewSeo}>
            Save New Entry
          </Button>
        </Modal.Footer>
      </Modal>
    </Row>
  );
};

export default SeoList;
