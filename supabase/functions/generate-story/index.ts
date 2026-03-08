import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { story, image } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Build user message content - support text, image, or both
    const userContent: any[] = [];
    
    if (image) {
      userContent.push({
        type: "image_url",
        image_url: { url: `data:image/jpeg;base64,${image}` }
      });
    }
    
    const textParts: string[] = [];
    if (story?.trim()) {
      textParts.push(`Here is the artisan's story: "${story}".`);
    }
    if (image) {
      textParts.push("I've also attached a personal photo — it could be of the artisan, their family, or their workspace. Please weave details from the photo into the brand story to make it more personal and authentic.");
    }
    textParts.push("Generate brand content from this.");
    
    userContent.push({ type: "text", text: textParts.join(" ") });

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are an expert brand storyteller for Indian artisan crafts. Convert the artisan's personal craft story and/or craft image into professional brand content. If an image is provided, describe the visual elements and weave them into the narrative. You must call the create_brand_content function.`
          },
          {
            role: "user",
            content: userContent
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "create_brand_content",
              description: "Generate brand storytelling content from an artisan's story and/or craft image",
              parameters: {
                type: "object",
                properties: {
                  brandStory: { type: "string", description: "A compelling brand story paragraph (3-4 sentences)" },
                  aboutSection: { type: "string", description: "Website about section (2-3 sentences)" },
                  instagramCaption: { type: "string", description: "Instagram caption with emojis and hashtags" }
                },
                required: ["brandStory", "aboutSection", "instagramCaption"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "create_brand_content" } }
      }),
    });

    if (!response.ok) {
      const status = response.status;
      const text = await response.text();
      if (status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      console.error("AI gateway error:", status, text);
      throw new Error(`AI gateway error: ${status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in response");

    const content = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify(content), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-story error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
