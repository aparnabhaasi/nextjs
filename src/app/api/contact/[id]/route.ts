import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const contactId = params.id;

    if (!contactId) {
      return NextResponse.json({ error: "Missing contact ID" }, { status: 400 });
    }

    const deletedcontact = await prisma.contact.delete({
      where: { id: contactId },
    });

    return NextResponse.json({ message: "contact deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the contact." },
      { status: 500 }
    );
  }
}

 
