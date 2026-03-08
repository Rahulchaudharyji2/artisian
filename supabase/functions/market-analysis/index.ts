import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { productCategory, craftType } = await req.json();
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
            content: `You are a global market analyst specializing in handmade crafts and artisan goods. Analyze market potential for Indian craft products. Call the create_market_analysis function.`
          },
          {
            role: "user",
            content: `Analyze global market potential for: Category: ${productCategory}, Craft Type: ${craftType}`
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "create_market_analysis",
              description: "Generate global market analysis for an artisan craft category",
              parameters: {
                type: "object",
                properties: {
                  topMarkets: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        country: { type: "string" },
                        reason: { type: "string" },
                        demandLevel: { type: "string", enum: ["High", "Medium", "Low"] }
                      },
                      required: ["country", "reason", "demandLevel"]
                    },
                    description: "Top 5 countries to sell this craft"
                  },
                  trendingKeywords: { type: "array", items: { type: "string" }, description: "8-10 trending search keywords" },
                  buyerPersona: { type: "string", description: "Ideal buyer persona description" },
                  pricingRange: { type: "string", description: "Recommended international pricing range in USD" }
                },
                required: ["topMarkets", "trendingKeywords", "buyerPersona", "pricingRange"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "create_market_analysis" } }
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
    console.error("market-analysis error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
