import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { join } from "path";
import { writeFile, stat, mkdir } from "fs/promises";

const prisma = new PrismaClient();

// Utility function to check if an error is an ErrnoException
function isErrnoException(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && (error as NodeJS.ErrnoException).code !== undefined;
}

// Helper function to handle image uploads
async function handleImageUpload(image: File): Promise<string | undefined> {
  if (!image) return undefined; // Ensure image is valid

  const buffer = Buffer.from(await image.arrayBuffer());
  const relativeUploadDir = `/uploads/${new Date(Date.now()).toISOString().split("T")[0]}`;
  const uploadDir = join(process.cwd(), "public", relativeUploadDir);

  try {
    await stat(uploadDir);
  } catch (error) {
    if (isErrnoException(error) && error.code === "ENOENT") {
      await mkdir(uploadDir, { recursive: true });
    } else {
      throw error; // Ensure proper error handling
    }
  }

  const fileName = `${Date.now()}_${image.name}`;
  const filePath = join(uploadDir, fileName);

  await writeFile(filePath, buffer);
  return `${relativeUploadDir}/${fileName}`;
}

// POST - Create blog
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const image = formData.get("image");

  if (!title || !description) {
    return NextResponse.json({ error: "Title and description are required." }, { status: 400 });
  }

  try {
    let imageUrl: string | undefined = "/default-image.jpg"; // Use undefined instead of null
  
    if (image instanceof File) {
      const uploadedImageUrl = await handleImageUpload(image);
      imageUrl = uploadedImageUrl || "/default-image.jpg"; // Ensures it's always a string
    }
  
    const blog = await prisma.blog.create({
      data: {
        title,
        description,
        imageUrl, // Now correctly typed as string | undefined
      },
    });
  
    return NextResponse.json(blog, { status: 201 }); // Use 201 for resource creation
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json({ error: "Error creating blog." }, { status: 500 });
  }
}

// GET - List all blogs
export async function GET() {
  try {
    const blogs = await prisma.blog.findMany();
    return NextResponse.json(blogs, { status: 200 });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ error: "Error fetching blogs." }, { status: 500 });
  }
}
