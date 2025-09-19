import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const { id } = params;
//     
//     // Fetch user achievements
//     const achievements = await prisma.achievement.findMany({
//       where: { userId: id },
//       orderBy: { earnedAt: 'desc' }
//     });
//     
//     return NextResponse.json({ achievements });
//   } catch (error) {
//     console.error("Achievements fetch error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

export async function GET() {
  return new Response(JSON.stringify({ achievements: [] }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
