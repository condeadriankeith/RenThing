import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "messages required" }, { status: 400 });
    }

    const ollamaEnabled = process.env.OLLAMA_ENABLED === "true";
    const host = process.env.OLLAMA_HOST ?? "http://localhost:11434";
    const model = process.env.OLLAMA_MODEL ?? "llama3.1:8b";

    // helper last user text
    const lastText = (messages[messages.length - 1]?.content ?? "").trim();

    if (!ollamaEnabled) {
      // If Ollama intentionally disabled, provide a predictable fallback for greetings
      if (/^(hi|hello|hey|good (morning|afternoon|evening))/i.test(lastText)) {
        return NextResponse.json({ reply: "Hi — I'm REN! How can I help today?" });
      }
      return NextResponse.json({ error: "AI disabled" }, { status: 503 });
    }

    // Build a simple prompt (you can replace with the project's system prompt)
    const prompt = messages.map((m: any) => `${m.role.toUpperCase()}: ${m.content}`).join("\n");

    // Call Ollama REST API with stream=false to get a single response
    const timeout = 20000;
    const resp = await axios.post(
      `${host}/api/generate`,
      {
        model,
        prompt,
        stream: false  // This is important - set to false to get a single response
      },
      { timeout }
    );

    // Extract the response text from Ollama's response
    let text: string | undefined;
    if (resp.data?.response && typeof resp.data.response === "string") {
      text = resp.data.response;
    } else {
      // Fallback to handling the response as a stringified JSON
      try {
        const parsed = JSON.parse(JSON.stringify(resp.data));
        text = parsed.response || JSON.stringify(parsed);
      } catch (parseError) {
        text = JSON.stringify(resp.data);
      }
    }

    return NextResponse.json({ reply: text }, { status: 200 });
  } catch (err: any) {
    // Log full error server-side so you can inspect in logs
    console.error("AI generate error:", err?.message ?? err, err?.response?.data ?? "");

    const body = await (req.clone().json().catch(() => ({})));
    const messages = body.messages ?? [];
    const lastText = (messages[messages.length - 1]?.content ?? "").trim();

    // Smart simple greeting fallback only for greeting-like messages
    if (/^(hi|hello|hey|good (morning|afternoon|evening))/i.test(lastText)) {
      return NextResponse.json({
        reply:
          "Hi — I'm REN! I'm having trouble contacting my AI right now. You can try again, or use one of the quick options below.",
      });
    }

    // Explicit error code so frontend can present "AI offline" states
    return NextResponse.json({ error: "AI service unavailable" }, { status: 503 });
  }
}