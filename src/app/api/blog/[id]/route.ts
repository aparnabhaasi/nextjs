import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { join } from "path";
import mime from "mime";
import { writeFile, stat, mkdir } from "fs/promises";


const prisma = new PrismaClient();

// Helper function to handle image uploads
async function handleImageUpload(image: File) {
    const buffer = Buffer.from(await image.arrayBuffer());
    const relativeUploadDir = `/uploads/${new Date(Date.now()).toISOString().split("T")[0]}`;
    const uploadDir = join(process.cwd(), "public", relativeUploadDir);

    try {
        await stat(uploadDir);
    } catch (e) {
        if (e instanceof Error && "code" in e && e.code === "ENOENT") {
            await mkdir(uploadDir, { recursive: true });
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

// DELETE Handler
export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  try {
      const { id } = context.params;
      await prisma.blog.delete({ where: { id } });
      return NextResponse.json({ message: "Blog deleted successfully." }, { status: 200 });
  } catch (e) {
      console.error("Error deleting blog:", e);
      return NextResponse.json({ error: "Error deleting blog." }, { status: 500 });
  }
}

// PUT Handler
export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  try {
      const { id } = context.params;
      return NextResponse.json({ message: `Updated blog with ID: ${id}` });
  } catch (error) {
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
