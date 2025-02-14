import { PrismaClient } from "@prisma/client";
import mime from "mime";
import { join } from "path";
import { stat, mkdir, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const title = formData.get("title") as string;
  const image = formData.get("image") as File;

  if (!title || !image) {
    return NextResponse.json(
      { error: "Title and image are required." },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await image.arrayBuffer());
  const relativeUploadDir = `/uploads/${new Date(Date.now())
    .toISOString()
    .split("T")[0]}`; // Directory in yyyy-mm-dd format
  const uploadDir = join(process.cwd(), "public", relativeUploadDir);

  try {
    await stat(uploadDir);
  } catch (e: any) {
    if (e.code === "ENOENT") {
      await mkdir(uploadDir, { recursive: true }); // Create directory if it doesn't exist
    } else {
      console.error("Directory creation error:", e);
      return NextResponse.json(
        { error: "Error creating upload directory." },
        { status: 500 }
      );
    }
  }

  try {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${image.name.replace(/\.[^/.]+$/, "")}-${uniqueSuffix}.${mime.getExtension(image.type)}`;
    const filePath = `${uploadDir}/${filename}`;
    const fileUrl = `${relativeUploadDir}/${filename}`;

    await writeFile(filePath, buffer);

    // Save to the database
    const slider = await prisma.slider.create({
      data: {
        title,
        imageUrl: fileUrl,
      },
    });

    return NextResponse.json(slider, { status: 201 });
  } catch (e) {
    console.error("File upload error:", e);
    return NextResponse.json(
      { error: "Error while uploading file." },
      { status: 500 }
    );
  }
}

export async function GET() {
    try {
      const courses = await prisma.slider.findMany({
        select: {
          id: true,
          title: true,
          imageUrl: true,
          createdAt: true, // Optional but recommended for sorting
        },
        orderBy: { createdAt: "desc" },
      });
  
      return NextResponse.json(courses, { status: 200 });
    } catch (error) {
      console.error("Error retrieving courses:", error);
      return NextResponse.json(
        { error: "An error occurred while retrieving courses." },
        { status: 500 }
      );
    }
  }
