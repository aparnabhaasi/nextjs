import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const contacts = await prisma.booking.findMany({
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        mobile: true,
        message: true,
        createdAt: true,
        course: {
          select: {
            title: true, // Selecting the course title
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Ensure that the contacts are in an array
    if (!Array.isArray(contacts)) {
      throw new Error("Expected an array of contacts");
    }

    // Attach the course title to each booking entry
    const formattedContacts = contacts.map(contact => ({
      ...contact,
      courseTitle: contact.course?.title || "No course title", // Safe fallback if the course is null
    }));

    return NextResponse.json(formattedContacts, { status: 200 });
  } catch (error) {
    console.error("Error retrieving contacts:", error);

    // Check if error has a message property or use a fallback message
    const errorMessage = error instanceof Error ? error.message : "An error occurred while retrieving contacts.";
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
