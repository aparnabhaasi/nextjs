import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { join } from "path";
import mime from "mime";
import { writeFile, stat, mkdir } from "fs/promises";

const prisma = new PrismaClient();

// Helper function to handle image uploads
async function handleImageUpload(image: File) {
  const buffer = Buffer.from(await image.arrayBuffer());
  const relativeUploadDir = `/uploads/${new Date(Date.now()).toISOString().split("T")[0]}`; // Date format: yyyy-mm-dd
  const uploadDir = join(process.cwd(), "public", relativeUploadDir);

  try {
    await stat(uploadDir);
  } catch (e) {
    const error = e as NodeJS.ErrnoException; // Explicitly type the error
    if (error.code === "ENOENT") {
      await mkdir(uploadDir, { recursive: true }); // Create the directory if it doesn't exist
    } else {
      throw new Error("Error creating upload directory.");
    }
  }

  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const filename = `${image.name.replace(/\.[^/.]+$/, "")}-${uniqueSuffix}.${mime.getExtension(image.type)}`;
  const filePath = `${uploadDir}/${filename}`;
  const fileUrl = `${relativeUploadDir}/${filename}`;

  await writeFile(filePath, buffer);
  return fileUrl;
}

// GET Handler: Fetches all services
export async function GET(req: NextRequest) {
  try {
    const services = await prisma.service.findMany();

    if (!services || services.length === 0) {
      return NextResponse.json({ message: "No services found." }, { status: 404 });
    }

    return NextResponse.json(services, { status: 200 });
  } catch (e) {
    console.error("Error fetching services:", e);
    return NextResponse.json({ error: "Error fetching services." }, { status: 500 });
  }
}

// DELETE Handler: Deletes a service entry by ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await prisma.service.delete({ where: { id } });
    return NextResponse.json({ message: "Service deleted successfully." }, { status: 200 });
  } catch (e) {
    console.error("Error deleting service:", e);
    return NextResponse.json({ error: "Error deleting service." }, { status: 500 });
  }
}

// PUT Handler: Updates a service entry by ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const data = await req.json();

    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No data provided for update." }, { status: 400 });
    }

    const updatedService = await prisma.service.update({
      where: { id },
      data,
    });

    return NextResponse.json(updatedService, { status: 200 });
  } catch (e) {
    console.error("Error updating service:", e);
    return NextResponse.json({ error: "Error updating service." }, { status: 500 });
  }
}
