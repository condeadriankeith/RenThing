import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  let body: any = {};
  let messages: any[] = [];
  let lastText = "";
  
  try {
    body = await req.json();
    messages = body.messages ?? [];
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "messages required" }, { status: 400 });
    }

    // helper last user text
    lastText = (messages[messages.length - 1]?.content ?? "").trim();

    const ollamaEnabled = process.env.OLLAMA_ENABLED === "true";
    const host = process.env.OLLAMA_HOST ?? "http://localhost:11434";
    const model = process.env.OLLAMA_MODEL ?? "llama3.1:8b";

    if (!ollamaEnabled) {
      // If Ollama intentionally disabled, provide a predictable fallback for greetings
      if (/^(hi|hello|hey|good (morning|afternoon|evening))/i.test(lastText)) {
        return NextResponse.json({ reply: "Hi — I'm REN! How can I help today?" });
      }
      return NextResponse.json({ error: "AI disabled" }, { status: 503 });
    }

    // Build a simple prompt (you can replace with the project's system prompt)
    // Use just the last message content instead of formatting with roles
    const prompt = lastText;
    
    // Log the prompt for debugging
    console.log("Sending prompt to Ollama:", prompt);

    // Call Ollama REST API with stream=false to get a single response
    const timeout = 60000; // Increase timeout to 60 seconds
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