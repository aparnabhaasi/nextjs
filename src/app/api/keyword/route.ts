import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Handle POST (Create a new keyword)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const keyword = await prisma.keyword.create({
      data: { title },
    });

    return NextResponse.json(keyword, { status: 201 });
  } catch (error) {
    console.error("Error creating keyword:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the keyword." },
      { status: 500 }
    );
  }
}

// Handle GET (Retrieve all keywords)
export async function GET() {
    try {
      const keywords = await prisma.keyword.findMany({
        select: {
          id: true,
          title: true,
          createdAt: true, // Optional but recommended for sorting
        },
        orderBy: { createdAt: "desc" },
      });
  
      return NextResponse.json(keywords, { status: 200 });
    } catch (error) {
      console.error("Error retrieving keywords:", error);
      return NextResponse.json(
        { error: "An error occurred while retrieving keywords." },
        { status: 500 }
      );
    }
  }
  
