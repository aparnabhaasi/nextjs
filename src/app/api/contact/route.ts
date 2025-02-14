// api/contact/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        subject: true,
        message: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Ensure that the contacts are in an array
    if (!Array.isArray(contacts)) {
      throw new Error("Expected an array of contacts");
    }

    return NextResponse.json(contacts, { status: 200 });
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


