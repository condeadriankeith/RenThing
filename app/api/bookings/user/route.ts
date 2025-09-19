import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Fetch user's bookings
    // const bookings = await prisma.booking.findMany({
    //   where: { userId: session.user.id },
    //   include: {
    //     listing: {
    //       select: {
    //         id: true,
    //         title: true,
    //         description: true,
    //         price: true,
    //         location: true,
    //         images: true,
    //       }
    //     }
    //   },
    //   orderBy: { createdAt: 'desc' }
    // });

    // For now, return mock bookings
    const bookings: any[] = [];

    return NextResponse.json({ bookings });
  } catch (error) {
    logger.error("User bookings fetch error", { error });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}