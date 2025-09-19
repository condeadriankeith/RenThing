import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logger } from "@/lib/logger";

interface RouteParams {
  id: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { id } = params;

    // Fetch user
    // const user = await prisma.user.findUnique({
    //   where: { id },
    //   select: {
    //     id: true,
    //     name: true,
    //     email: true,
    //     role: true,
    //     avatar: true,
    //     bio: true,
    //     location: true,
    //     socialLinks: true,
    //     responseTime: true,
    //     isVerified: true,
    //     theme: true,
    //     background: true,
    //     createdAt: true,
    //   }
    // });

    // For now, return mock user
    const user = {
      id,
      name: "Mock User",
      email: "mock@example.com",
      role: "user",
      avatar: null,
      bio: null,
      location: null,
      socialLinks: null,
      responseTime: null,
      isVerified: false,
      theme: null,
      background: null,
      createdAt: new Date(),
    };

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    logger.error("User fetch error", { error });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { id } = params;
    
    // Check if user is authorized to update this profile
    if (session.user.id !== id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const { name, bio, location, socialLinks, theme, background } = await request.json();

    // Update user
    // const updatedUser = await prisma.user.update({
    //   where: { id },
    //   data: {
    //     ...(name && { name }),
    //     ...(bio && { bio }),
    //     ...(location && { location }),
    //     ...(socialLinks && { socialLinks }),
    //     ...(theme && { theme }),
    //     ...(background && { background }),
    //   },
    //   select: {
    //     id: true,
    //     name: true,
    //     email: true,
    //     role: true,
    //     avatar: true,
    //     bio: true,
    //     location: true,
    //     socialLinks: true,
    //     responseTime: true,
    //     isVerified: true,
    //     theme: true,
    //     background: true,
    //     createdAt: true,
    //   }
    // });

    // For now, return mock updated user
    const updatedUser = {
      id,
      name: name || "Mock User",
      email: "mock@example.com",
      role: "user",
      avatar: null,
      bio: bio || null,
      location: location || null,
      socialLinks: socialLinks || null,
      responseTime: null,
      isVerified: false,
      theme: theme || null,
      background: background || null,
      createdAt: new Date(),
    };

    logger.info("User profile updated", { userId: id });
    
    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    logger.error("User update error", { error });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
