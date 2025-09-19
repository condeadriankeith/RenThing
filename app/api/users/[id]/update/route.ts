// import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const session = await getServerSession(authOptions);
//     
//     if (!session?.user) {
//       return NextResponse.json(
//         { error: "Not authenticated" },
//         { status: 401 }
//       );
//     }

//     const { id } = params;
    
//     // Check if user is authorized to update this profile
//     if (session.user.id !== id && session.user.role !== 'ADMIN') {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 403 }
//       );
//     }

//     const { name, bio, location, socialLinks, theme, background } = await request.json();

//     // Update user
//     const updatedUser = await prisma.user.update({
//       where: { id },
//       data: {
//         ...(name && { name }),
//         ...(bio && { bio }),
//         ...(location && { location }),
//         ...(socialLinks && { socialLinks }),
//         ...(theme && { theme }),
//         ...(background && { background }),
//       },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         role: true,
//         avatar: true,
//         bio: true,
//         location: true,
//         socialLinks: true,
//         responseTime: true,
//         isVerified: true,
//         theme: true,
//         background: true,
//         createdAt: true,
//       }
//     });

//     return NextResponse.json({ user: updatedUser });
//   } catch (error) {
//     console.error("User update error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

export async function PUT() {
  return new Response(JSON.stringify({ user: null }), {
    headers: { 'Content-Type': 'application/json' }
  });
}