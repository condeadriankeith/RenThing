import { NextRequest } from "next/server"
import { NextApiResponse } from "next"
import { initSocketIO } from "@/lib/socket-server"

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: {
    server: any
  }
}

export async function GET(req: NextRequest, res: NextApiResponseWithSocket) {
  if (res.socket?.server) {
    initSocketIO(res as any)
    res.end()
  } else {
    res.status(500).json({ error: "Socket server not available" })
  }
}

export async function POST(req: NextRequest, res: NextApiResponseWithSocket) {
  if (res.socket?.server) {
    initSocketIO(res as any)
    res.end()
  } else {
    res.status(500).json({ error: "Socket server not available" })
  }
}