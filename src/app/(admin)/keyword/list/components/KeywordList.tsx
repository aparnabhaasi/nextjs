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

  // For modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProperty, setEditProperty] = useState<Property | null>(null);

  // For New Keyword Modal
  const [showKeywordModal, setShowKeywordModal] = useState(false);
  const [newKeyword, setNewKeyword] = useState<string>("");

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/keyword");
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

  // Handle keyword deletion
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/keyword/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPropertyListData((prevData) =>
          prevData.filter((item) => String(item.id) !== id)
        );
      } else {
        console.error("Failed to delete keyword");
      }
    } catch (error) {
      console.error("Error deleting keyword:", error);
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
        const response = await fetch(`/api/keyword/${editProperty.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editProperty),
        });

        if (response.ok) {
          // Update the keyword data in the list
          setPropertyListData((prevData) =>
            prevData.map((item) =>
              item.id === editProperty.id ? editProperty : item
            )
          );
          setShowEditModal(false);
        } else {
          console.error("Failed to update keyword");
        }
      } catch (error) {
        console.error("Error updating keyword:", error);
      }
    }
  };

  // Handle adding new keyword
  const handleAddKeyword = async () => {
    try {
      const response = await fetch("/api/keyword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newKeyword }),
      });

      if (response.ok) {
        const addedKeyword = await response.json();
        setPropertyListData((prevData) => [...prevData, addedKeyword]);
        setShowKeywordModal(false);
        setNewKeyword("");
      } else {
        console.error("Failed to add new keyword");
      }
    } catch (error) {
      console.error("Error adding new keyword:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
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
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowKeywordModal(true)} // Open modal for adding keyword
              >
                New Keyword{" "}
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
            {propertyListData.length === 0 ? (
              <div>No properties found. Please add a new keyword.</div>
            ) : (
              <table className="table align-middle text-nowrap table-hover table-centered mb-0">
                <thead className="bg-light-subtle">
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {propertyListData.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
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
            )}
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
                  onChange={(e) =>
                    setEditProperty({ ...editProperty, title: e.target.value })
                  }
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

      {/* New Keyword Modal */}
      <Modal show={showKeywordModal} onHide={() => setShowKeywordModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Keyword</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formKeyword">
              <Form.Label>Keyword</Form.Label>
              <Form.Control
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="Enter new keyword"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowKeywordModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddKeyword}>
            Add Keyword
          </Button>
        </Modal.Footer>
      </Modal>
    </Row>
  );
};

export default PropertyList;

