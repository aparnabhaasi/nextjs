import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const keywordId = params.id;

    if (!keywordId) {
      return NextResponse.json({ error: "Missing keyword ID" }, { status: 400 });
    }

    const deletedkeyword = await prisma.keyword.delete({
      where: { id: keywordId },
    });

    return NextResponse.json({ message: "keyword deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting keyword:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the keyword." },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const keywordId = params.id;
    const body = await req.json();

    if (!keywordId || !body.title) {
      return NextResponse.json({ error: "Missing keyword ID or title" }, { status: 400 });
    }

    const updatedkeyword = await prisma.keyword.update({
      where: { id: keywordId },
      data: {
        title: body.title, // Update other fields as needed
      },
    });

    return NextResponse.json(updatedkeyword, { status: 200 });
  } catch (error) {
    console.error("Error updating keyword:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the keyword." },
      { status: 500 }
    );
  }
}
