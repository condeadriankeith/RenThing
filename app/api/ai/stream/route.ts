import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { Readable } from "stream";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, max_tokens = 150, temperature = 0.7 } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const ollamaEnabled = process.env.OLLAMA_ENABLED === "true";
    const host = process.env.OLLAMA_HOST ?? "http://localhost:11434";
    const model = process.env.OLLAMA_MODEL ?? "phi3:mini";

    if (!ollamaEnabled) {
      return NextResponse.json({ error: "AI disabled" }, { status: 503 });
    }

    // Create a readable stream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Call Ollama with streaming enabled
          const response = await axios.post(
            `${host}/api/generate`,
            {
              model,
              prompt,
              stream: true,
              options: {
                temperature,
                num_predict: max_tokens
              }
            },
            {
              responseType: 'stream',
              timeout: 15000 // 15 second timeout
            }
          );

          // Handle the streaming response
          response.data.on('data', (chunk: any) => {
            try {
              const lines = chunk.toString().split('\n');
              for (const line of lines) {
                if (line.trim()) {
                  const data = JSON.parse(line);
                  if (data.response) {
                    // Encode the response and enqueue it
                    const encoded = new TextEncoder().encode(data.response);
                    controller.enqueue(encoded);
                  }
                  // If we get a done signal, close the stream
                  if (data.done) {
                    controller.close();
                    break;
                  }
                }
              }
            } catch (err) {
              console.error("Error parsing stream chunk:", err);
              controller.error(err);
            }
          });

          response.data.on('end', () => {
            controller.close();
          });

          response.data.on('error', (err: any) => {
            console.error("Stream error:", err);
            controller.error(err);
          });

        } catch (err: any) {
          console.error("AI stream error:", err?.message ?? err);
          controller.error(err);
        }
      }
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (err: any) {
    console.error("AI stream endpoint error:", err?.message ?? err);
    return NextResponse.json({ error: "AI service unavailable" }, { status: 503 });
  }
}