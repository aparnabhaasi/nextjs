import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// DELETE Handler: Deletes an SEO entry by ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const seoId = params.id; // Extract ID from params

    if (!seoId) {
      return NextResponse.json({ error: "SEO ID is required" }, { status: 400 });
    }

    const deletedSeo = await prisma.seo.delete({
      where: { id: seoId }, // Ensure `id` is correctly passed and exists
    });

    return NextResponse.json({ message: "SEO entry deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting SEO entry:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the SEO entry." },
      { status: 500 }
    );
  }
}

// PUT Handler: Updates an SEO entry by ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const seoId = params.id; // ID received from URL params
    const body = await req.json(); // Request body

    if (!seoId || !body.title || !body.description) {
      return NextResponse.json(
        { error: "Missing SEO ID, title, or description" },
        { status: 400 }
      );
    }

    // Update the SEO entry in the database
    const updatedSeo = await prisma.seo.update({
      where: { id: seoId }, // Assuming `id` is a string (UUID) in your schema
      data: {
        title: body.title,
        description: body.description,
        page: body.page, // Optional field
      },
    });

    return NextResponse.json(updatedSeo, { status: 200 });
  } catch (error) {
    console.error("Error updating SEO entry:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the SEO entry." },
      { status: 500 }
    );
  }
}

