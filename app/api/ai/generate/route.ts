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

    // Create a comprehensive but concise system prompt to ensure REN responds as REN
    const systemPrompt = `
You are REN, the AI assistant for RenThing rental marketplace. Always respond as REN, never as Ollama or Llama.

REN's personality:
- Friendly, helpful, and culturally aware with Filipino values
- Malasakit (compassionate care), Kapamilya (family-oriented), Resourceful, Culturally sensitive, Tech-savvy
- Use natural Filipino expressions when appropriate
- Always identify as REN when asked "who are you"

Available RenThing Pages and Navigation:
- Homepage: "/"
- Browse rentals: "/browse"
- List an item: "/list-item"
- My bookings: "/my-bookings"
- Inbox: "/inbox"
- Wishlist: "/wishlist"
- Profile: "/profile"
- Login: "/auth/login"
- Register: "/auth/register"
- Help center: "/help"
- About: "/about"
- Contact: "/contact"
- Terms: "/terms"
- Privacy: "/privacy"
- Specific listing: "/listing/[id]"
- Specific user profile: "/profile/[id]"

Response guidelines:
1. Be concise and helpful - keep responses under 3 sentences
2. Stay in character as REN
3. Focus on RenThing platform features
4. Personalize based on conversation context
5. Get straight to the point - avoid unnecessary elaboration
6. Use bullet points or numbered lists for complex information
7. When asked to navigate or show a page, respond with the appropriate action:
   - For general pages: {"type": "navigate", "payload": {"path": "/page-path"}}
   - For specific listings: {"type": "show_listing", "payload": {"listingId": "listing-id"}}
   - For search queries: {"type": "search_query", "payload": {"query": "search terms"}}
8. Always provide helpful text explaining what you're doing
`;

    // Build the complete prompt with system context
    const fullMessages = [
      { role: "system", content: systemPrompt.trim() },
      ...messages
    ];
    
    // Log for debugging
    console.log("Sending to Ollama:", {
      model,
      messageCount: fullMessages.length
    });

    // Call Ollama with optimized settings for faster response
    const timeout = 20000; // Reduced timeout for better UX
    const resp = await axios.post(
      `${host}/api/chat`,
      {
        model,
        messages: fullMessages,
        stream: false,
        options: {
          temperature: 0.5, // Lower temperature for more focused responses
          top_p: 0.8, // Slightly reduced for more deterministic responses
          repeat_penalty: 1.1,
          num_predict: 200 // Significantly limit response length for faster responses
        }
      },
      { 
        timeout,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // Extract response text
    let text: string | undefined;
    let action: any = undefined;
    
    if (resp.data?.message?.content && typeof resp.data.message.content === "string") {
      text = resp.data.message.content.trim();
      
      // Try to extract action from the response
      try {
        // Look for JSON action in the response
        if (text) {
          const actionMatch = text.match(/\{[^{}]*\}/g);
          if (actionMatch) {
            const potentialAction = JSON.parse(actionMatch[0]);
            if (potentialAction.type && potentialAction.payload) {
              action = potentialAction;
              // Remove the JSON from the text response
              text = text.replace(actionMatch[0], '').trim();
            }
          }
        }
      } catch (e) {
        // If JSON parsing fails, continue with just the text
        console.log("Failed to parse action from response:", e);
      }
    } else {
      text = "I'm REN, your RenThing assistant. How can I help you today?";
    }

    // Ensure REN identifies correctly
    if (text && /^(hi|hello|hey|good (morning|afternoon|evening))/i.test(lastText)) {
      if (!text.toLowerCase().includes("ren") || text.toLowerCase().includes("llama") || text.toLowerCase().includes("ollama")) {
        text = "Hi — I'm REN! " + text.replace(/(I'm|I am) (an AI|a model|an assistant|Ollama|Llama)/gi, "");
      }
    }

    const response: any = { reply: text };
    if (action) {
      response.action = action;
    }

    return NextResponse.json(response, { status: 200 });
  } catch (err: any) {
    console.error("AI generate error:", err?.message ?? err);
    
    // Faster fallback responses
    if (/^(hi|hello|hey|good (morning|afternoon|evening))/i.test(lastText)) {
      return NextResponse.json({
        reply: "Hi — I'm REN! I'm having trouble right now. Try again or use quick options.",
      });
    }

    return NextResponse.json({ error: "AI service unavailable" }, { status: 503 });
  }
}