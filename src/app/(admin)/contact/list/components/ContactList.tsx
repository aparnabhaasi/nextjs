'use client';

import { useEffect, useState } from 'react';
import { Button, Card, CardFooter, CardHeader, CardTitle, Col, Row } from 'react-bootstrap';
import Link from 'next/link';

type Contact = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
};

const ContactList = () => {
  const [contactListData, setContactListData] = useState<Contact[]>([]);

  // Fetch contact data on component mount
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch('/api/contact');
        const data = await response.json();
        console.log(data);  // Log the data to inspect its structure
        setContactListData(data);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };
    

    fetchContacts();
  }, []);

  // Handle delete contact
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setContactListData((prevData) => prevData.filter(contact => contact.id !== id));
      } else {
        console.error("Failed to delete contact");
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  return (
    <Row>
      <Col xl={12}>
        <Card>
          <CardHeader className="d-flex justify-content-between align-items-center border-bottom">
            <div>
              <CardTitle as="h4" className="mb-0">Contact List</CardTitle>
            </div>
          </CardHeader>
          <div className="table-responsive">
            <table className="table align-middle text-nowrap table-hover table-centered mb-0">
              <thead className="bg-light-subtle">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>Created At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {contactListData.map((contact, idx) => (
                  <tr key={contact.id}>
                    <td>{idx + 1}</td>
                    <td>{contact.name}</td>
                    <td>{contact.email}</td>
                    <td>{contact.subject}</td>
                    <td>{contact.message}</td>
                    <td>{new Date(contact.createdAt).toLocaleString()}</td>
                    <td>
                      <Button variant="soft-danger" size="sm" onClick={() => handleDelete(contact.id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <CardFooter>
            {/* Pagination could go here */}
          </CardFooter>
        </Card>
      </Col>
    </Row>
  );
};

export default ContactList;
