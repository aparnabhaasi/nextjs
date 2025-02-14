import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { join } from "path";
import mime from "mime";
import { writeFile, stat, mkdir } from "fs/promises";

const prisma = new PrismaClient();

// Helper function to handle image uploads
async function handleImageUpload(image: File): Promise<string> {
  const buffer = Buffer.from(await image.arrayBuffer());
  const relativeUploadDir = `/uploads/${new Date().toISOString().split("T")[0]}`;
  const uploadDir = join(process.cwd(), "public", relativeUploadDir);

  try {
    await stat(uploadDir);
  } catch (e: unknown) {
    if (e instanceof Error && "code" in e && (e as any).code === "ENOENT") {
      await mkdir(uploadDir, { recursive: true });
    } else {
      throw e; // Rethrow unexpected errors
    }
  }

  const fileName = `${Date.now()}_${image.name}`;
  const filePath = join(uploadDir, fileName);
  await writeFile(filePath, buffer);

  return `${relativeUploadDir}/${fileName}`;
}

// POST - Create Service
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const image = formData.get("image");

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required." },
        { status: 400 }
      );
    }

    let imageUrl: string | null = "/default-image.jpg"; // Allow null

    if (image instanceof File) {
      imageUrl = await handleImageUpload(image);
    }
    
    const service = await prisma.service.create({
      data: {
        title,
        description,
        imageUrl: imageUrl ?? undefined, // Ensure Prisma handles optional correctly
      },
    });
    
    return NextResponse.json(service, { status: 200 });
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error("Error creating service:", e.message);
    } else {
      console.error("Unknown error:", e);
    }
    return NextResponse.json(
      { error: "Error creating service." },
      { status: 500 }
    );
  }
}

// GET - List all services
export async function GET() {
  try {
    const services = await prisma.service.findMany();
    
    // Ensure that `services` is not null or undefined before returning
    if (!services) {
      return NextResponse.json(
        { error: "No services found." },
        { status: 404 }
      );
    }

    return NextResponse.json(services, { status: 200 });
  } catch (e: unknown) {
    console.error("Error fetching services:", e);
    return NextResponse.json(
      { error: "Error fetching services." },
      { status: 500 }
    );
  }
}
