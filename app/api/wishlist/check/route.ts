// import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export async function GET(request: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions);
    
//     if (!session?.user) {
//       return NextResponse.json(
//         { error: "Not authenticated" },
//         { status: 401 }
//       );
//     }

//     const { searchParams } = new URL(request.url);
//     const listingId = searchParams.get('listingId');

//     if (!listingId) {
//       return NextResponse.json(
//         { error: "Listing ID is required" },
//         { status: 400 }
//       );
//     }

//     const wishlistItem = await prisma.wishlist.findUnique({
//       where: {
//         userId_listingId: {
//           userId: session.user.id,
//           listingId
//         }
//       }
//     });

//     return NextResponse.json({ isInWishlist: !!wishlistItem });
//   } catch (error) {
//     console.error("Wishlist check error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

export async function GET() {
  return new Response(JSON.stringify({ isInWishlist: false }), {
    headers: { 'Content-Type': 'application/json' }
  });
}