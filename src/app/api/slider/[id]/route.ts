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
    if (e instanceof Error && "code" in e && e.code === "ENOENT") {
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

// DELETE Handler: Deletes a slider entry by ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await prisma.slider.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Slider deleted successfully." }, { status: 200 });
  } catch (e) {
    console.error("Error deleting slider:", e);
    return NextResponse.json({ error: "Error deleting slider." }, { status: 500 });
  }
}

// PUT Handler: Updates a slider entry by ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const formData = await req.formData();

  const title = formData.get("title") as string;
  const image = formData.get("image") as File;

  if (!title) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }

  try {
    const imageUrl = image ? await handleImageUpload(image) : undefined;

    const slider = await prisma.slider.update({
      where: { id },
      data: {
        title,
        imageUrl, // Update with the new image URL if a new image is provided
      },
    });
    return NextResponse.json(slider, { status: 200 });
  } catch (e) {
    console.error("Error updating slider:", e);
    return NextResponse.json({ error: "Error updating slider." }, { status: 500 });
  }
}
