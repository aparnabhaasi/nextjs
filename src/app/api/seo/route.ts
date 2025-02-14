import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Handle POST (Create a new SEO entry)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { page, title, description } = body;

    // Validate input
    if (!page || !title || !description) {
      return NextResponse.json(
        { error: "Page, title, and description are required" },
        { status: 400 }
      );
    }

    const seoEntry = await prisma.seo.create({
      data: {
        page,
        title,
        description,
      },
    });

    return NextResponse.json(seoEntry, { status: 201 });
  } catch (error) {
    console.error("Error creating SEO entry:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the SEO entry." },
      { status: 500 }
    );
  }
}

// Handle GET (Retrieve all SEO entries)
export async function GET() {
  try {
    const seoEntries = await prisma.seo.findMany({
      select: {
        id: true,
        page: true,
        title: true,
        description: true,
        createdAt: true, // Optional, useful for sorting
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(seoEntries, { status: 200 });
  } catch (error) {
    console.error("Error retrieving SEO entries:", error);
    return NextResponse.json(
      { error: "An error occurred while retrieving SEO entries." },
      { status: 500 }
    );
  }
}
