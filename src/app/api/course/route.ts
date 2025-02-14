import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Handle POST (Create a new course)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const course = await prisma.course.create({
      data: { title },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the course." },
      { status: 500 }
    );
  }
}

// Handle GET (Retrieve all courses)
export async function GET() {
    try {
      const courses = await prisma.course.findMany({
        select: {
          id: true,
          title: true,
          createdAt: true, // Optional but recommended for sorting
        },
        orderBy: { createdAt: "desc" },
      });
  
      return NextResponse.json(courses, { status: 200 });
    } catch (error) {
      console.error("Error retrieving courses:", error);
      return NextResponse.json(
        { error: "An error occurred while retrieving courses." },
        { status: 500 }
      );
    }
  }
  
