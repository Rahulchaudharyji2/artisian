import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { craftDescription } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are an expert cultural anthropologist and craft historian specializing in Indian and global handicrafts. Given a description of a craft product, analyze it deeply and return structured data about its cultural significance. Be specific with historical dates, regions, and cultural context. Include fascinating lesser-known facts. Always provide rich, educational content that helps artisans understand and communicate the heritage value of their craft.`,
          },
          {
            role: "user",
            content: `Analyze this craft product and detect its cultural details: "${craftDescription}"`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "detect_craft_culture",
              description: "Return structured cultural analysis of a craft product",
              parameters: {
                type: "object",
                properties: {
                  craftType: {
                    type: "object",
                    properties: {
                      name: { type: "string", description: "Specific craft type name (e.g., Madhubani Painting, Blue Pottery)" },
                      category: { type: "string", description: "Broad category (e.g., Textile, Pottery, Painting, Metalwork, Woodwork)" },
                      technique: { type: "string", description: "Primary technique used (e.g., hand-painted, wheel-thrown, block-printed)" },
                      materials: {
                        type: "array",
                        items: { type: "string" },
                        description: "Traditional materials used",
                      },
                    },
                    required: ["name", "category", "technique", "materials"],
                  },
                  originRegion: {
                    type: "object",
                    properties: {
                      state: { type: "string", description: "State or province of origin" },
                      district: { type: "string", description: "Specific district or city" },
                      country: { type: "string", description: "Country of origin" },
                      geoTag: { type: "string", description: "GI tag status if applicable (e.g., 'GI Tagged since 2005')" },
                    },
                    required: ["state", "district", "country"],
                  },
                  culturalHistory: {
                    type: "object",
                    properties: {
                      era: { type: "string", description: "Historical era or period of origin (e.g., '16th century Mughal era')" },
                      story: { type: "string", description: "Rich narrative about the craft's cultural history (3-4 sentences)" },
                      significance: { type: "string", description: "Cultural and spiritual significance" },
                      patronage: { type: "string", description: "Historical patronage (e.g., royal courts, temples)" },
                      currentStatus: { type: "string", description: "Current status of the craft tradition (thriving, endangered, reviving)" },
                    },
                    required: ["era", "story", "significance", "patronage", "currentStatus"],
                  },
                  funFacts: {
                    type: "array",
                    items: { type: "string" },
                    description: "3 interesting lesser-known facts about this craft",
                  },
                  similarCrafts: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        region: { type: "string" },
                      },
                      required: ["name", "region"],
                    },
                    description: "3 similar crafts from other regions",
                  },
                },
                required: ["craftType", "originRegion", "culturalHistory", "funFacts", "similarCrafts"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "detect_craft_culture" } },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please wait a moment and try again." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error: " + response.status);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in AI response");

    const result = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("craft-detector error:", e);
    return new Response(JSON.stringify({ error: e.message || "Failed to analyze craft" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
