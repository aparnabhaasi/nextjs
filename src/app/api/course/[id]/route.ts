import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const courseId = params.id;

    if (!courseId) {
      return NextResponse.json({ error: "Missing course ID" }, { status: 400 });
    }

    const deletedCourse = await prisma.course.delete({
      where: { id: courseId },
    });

    return NextResponse.json({ message: "Course deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the course." },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const courseId = params.id;
    const body = await req.json();

    if (!courseId || !body.title) {
      return NextResponse.json({ error: "Missing course ID or title" }, { status: 400 });
    }

    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
        title: body.title, // Update other fields as needed
      },
    });

    return NextResponse.json(updatedCourse, { status: 200 });
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the course." },
      { status: 500 }
    );
  }
}
