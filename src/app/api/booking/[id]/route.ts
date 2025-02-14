import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const bookingId = params.id;

    if (!bookingId) {
      return NextResponse.json({ error: "Missing booking ID" }, { status: 400 });
    }

    const deletedbooking = await prisma.booking.delete({
      where: { id: bookingId },
    });

    return NextResponse.json({ message: "booking deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the booking." },
      { status: 500 }
    );
  }
}

 
