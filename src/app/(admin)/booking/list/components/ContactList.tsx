'use client';

import { useEffect, useState } from 'react';
import { Button, Card, CardFooter, CardHeader, CardTitle, Col, Row } from 'react-bootstrap';
import Link from 'next/link';

type Booking = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  courseTitle: string;
  message: string;
  createdAt: string;
};

const BookingList = () => {
  const [bookingListData, setBookingListData] = useState<Booking[]>([]);

  // Fetch booking data on component mount
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/booking');
        const data = await response.json();
        console.log(data);  // Log the data to inspect its structure
        setBookingListData(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  // Handle delete booking
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/booking/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setBookingListData((prevData) => prevData.filter(booking => booking.id !== id));
      } else {
        console.error("Failed to delete booking");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  return (
    <Row>
      <Col xl={12}>
        <Card>
          <CardHeader className="d-flex justify-content-between align-items-center border-bottom">
            <div>
              <CardTitle as="h4" className="mb-0">Booking List</CardTitle>
            </div>
          </CardHeader>
          <div className="table-responsive">
            <table className="table align-middle text-nowrap table-hover table-centered mb-0">
              <thead className="bg-light-subtle">
                <tr>
                  <th>#</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Course</th> {/* Added course column */}
                  <th>Message</th>
                  <th>Created At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookingListData.map((booking, idx) => (
                  <tr key={booking.id}>
                    <td>{idx + 1}</td>
                    <td>{booking.firstname}</td>
                    <td>{booking.lastname}</td>
                    <td>{booking.email}</td>
                    <td>{booking.courseTitle}</td> {/* Displaying course title */}
                    <td>{booking.message}</td>
                    <td>{new Date(booking.createdAt).toLocaleString()}</td>
                    <td>
                      <Button variant="soft-danger" size="sm" onClick={() => handleDelete(booking.id)}>
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

export default BookingList;
