"use client";

import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { useEffect, useState } from "react";
import { Button, Card, CardFooter, CardHeader, CardTitle, Col, Row, Modal, Form } from "react-bootstrap";
import Link from "next/link";

// Define the expected structure of the property data (TypeScript)
type Property = {
  id: number;
  title: string;
  createdAt?: string; // Optional field for timestamp
};

const PropertyList = () => {
  const [propertyListData, setPropertyListData] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // For modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProperty, setEditProperty] = useState<Property | null>(null);
  const [showAddTitleModal, setShowAddTitleModal] = useState(false);
  const [newTitle, setNewTitle] = useState<string>("");

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/course");
        const data: Property[] = await response.json();
        console.log("Fetched data:", data);
        setPropertyListData(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle course deletion
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/course/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPropertyListData((prevData) =>
          prevData.filter((item) => String(item.id) !== id)
        );
      } else {
        console.error("Failed to delete course");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  // Handle open modal for editing
  const handleEdit = (item: Property) => {
    setEditProperty(item);
    setShowEditModal(true);
  };

  // Handle update in the edit modal
  const handleUpdate = async () => {
    if (editProperty) {
      try {
        const response = await fetch(`/api/course/${editProperty.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editProperty),
        });

        if (response.ok) {
          // Update the course data in the list
          setPropertyListData((prevData) =>
            prevData.map((item) =>
              item.id === editProperty.id ? editProperty : item
            )
          );
          setShowEditModal(false);
        } else {
          console.error("Failed to update course");
        }
      } catch (error) {
        console.error("Error updating course:", error);
      }
    }
  };

  // Handle adding a new title
  const handleAddTitle = async () => {
    try {
      const response = await fetch("/api/course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTitle }),
      });

      if (response.ok) {
        const addedTitle = await response.json();
        setPropertyListData((prevData) => [...prevData, addedTitle]);
        setShowAddTitleModal(false);
        setNewTitle("");
      } else {
        console.error("Failed to add new title");
      }
    } catch (error) {
      console.error("Error adding new title:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!propertyListData.length) {
    return <div>No properties found.</div>;
  }

  return (
    <Row>
      <Col xl={12}>
        <Card>
          <CardHeader className="d-flex justify-content-between align-items-center border-bottom">
            <div>
              <CardTitle as={"h4"} className="mb-0">
                Properties
              </CardTitle>
            </div>
            <div>
              {/* New Title Button */}
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowAddTitleModal(true)} // Open modal for adding title
              >
                New Title{" "}
                <IconifyIcon
                  className="ms-1"
                  width={16}
                  height={16}
                  icon="ri:add-line"
                />
              </Button>
            </div>
          </CardHeader>
          <div className="table-responsive">
            <table className="table align-middle text-nowrap table-hover table-centered mb-0">
              <thead className="bg-light-subtle">
                <tr>
                  <th style={{ width: 20 }}>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="select-all"
                      />
                      <label className="form-check-label" htmlFor="select-all"></label>
                    </div>
                  </th>
                  <th>Title</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {propertyListData.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`select-${item.id}`}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`select-${item.id}`}
                        ></label>
                      </div>
                    </td>
                    <td>
                      <div>
                        <Link
                          href={`/properties/${item.id}`}
                          className="text-dark fw-medium fs-15"
                        >
                          {item.title ? item.title : "No Title Provided"}
                        </Link>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          variant="soft-primary"
                          size="sm"
                          onClick={() => handleEdit(item)} // Open modal for edit
                        >
                          <IconifyIcon
                            icon="solar:pen-2-broken"
                            className="align-middle fs-18"
                          />
                        </Button>
                        <Button
                          variant="soft-danger"
                          size="sm"
                          onClick={() => handleDelete(item.id.toString())} // Correctly pass `item.id`
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <CardFooter>
            {/* Pagination Code here */}
          </CardFooter>
        </Card>
      </Col>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Property</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editProperty && (
            <Form>
              <Form.Group controlId="formTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={editProperty.title}
                  onChange={(e) => setEditProperty({ ...editProperty, title: e.target.value })}
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

      {/* Add Title Modal */}
      <Modal show={showAddTitleModal} onHide={() => setShowAddTitleModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNewTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter new title"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddTitleModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddTitle}>
            Add Title
          </Button>
        </Modal.Footer>
      </Modal>
    </Row>
  );
};

export default PropertyList;
