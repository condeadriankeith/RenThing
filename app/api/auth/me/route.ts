import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Fetch user data from database
    // const user = await prisma.user.findUnique({
    //   where: { id: session.user.id },
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
    //   },
    // });

    // For now, return mock user data
    const user = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role,
      avatar: null,
      bio: null,
      location: null,
      socialLinks: null,
      responseTime: null,
      isVerified: false,
      theme: null,
      background: null,
    };

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}