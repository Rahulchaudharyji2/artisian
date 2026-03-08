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
            content: `You are a senior global market research analyst specializing in handmade crafts, artisan goods, and the global handicraft trade. Provide deeply researched, specific, data-driven market intelligence for Indian artisan products entering international markets. Include real platform names, specific cultural trends, seasonal demand patterns, and actionable strategies. Be thorough and detailed in every field. You must call the create_market_analysis function.`
          },
          {
            role: "user",
            content: `Provide a comprehensive global market analysis for an Indian artisan selling:
- Product Category: ${productCategory}
- Craft Type: ${craftType}

List the top 6 countries ranked by market potential. India MUST be included with its actual ranking position (it may or may not be #1 — rank it honestly based on real demand). Include specific countries with detailed reasons, real marketplace recommendations, seasonal trends, competition analysis, and actionable marketing strategies. Be specific and data-driven — avoid generic advice.`
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "create_market_analysis",
              description: "Generate comprehensive global market analysis for an artisan craft",
              parameters: {
                type: "object",
                properties: {
                  topMarkets: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        country: { type: "string", description: "Country name" },
                        reason: { type: "string", description: "Detailed reason why this market is ideal (2-3 sentences with specific cultural/economic factors)" },
                        demandLevel: { type: "string", enum: ["High", "Medium", "Low"] },
                        estimatedMarketSize: { type: "string", description: "Estimated market size or demand indicator e.g. '$2.3B handmade goods market'" },
                        bestPlatforms: { type: "array", items: { type: "string" }, description: "2-3 best selling platforms for this country e.g. Etsy, Amazon Handmade, local marketplaces" }
                      },
                      required: ["country", "reason", "demandLevel", "estimatedMarketSize", "bestPlatforms"],
                      additionalProperties: false
                    },
                    description: "Top 5 countries to sell this craft with detailed analysis"
                  },
                  trendingKeywords: {
                    type: "array",
                    items: { type: "string" },
                    description: "10-15 trending search keywords buyers use to find this type of product on marketplaces"
                  },
                  buyerPersona: {
                    type: "string",
                    description: "Detailed ideal buyer persona (at least 80 words) including demographics, lifestyle, shopping behavior, values, and what motivates their purchase"
                  },
                  pricingRange: {
                    type: "string",
                    description: "Recommended international pricing range in USD with tier breakdown (e.g. entry, mid, premium)"
                  },
                  seasonalTrends: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        season: { type: "string", description: "Season or event name e.g. 'Holiday Season', 'Diwali', 'Spring Home Refresh'" },
                        months: { type: "string", description: "Month range e.g. 'Oct-Dec'" },
                        insight: { type: "string", description: "Why demand peaks during this period" }
                      },
                      required: ["season", "months", "insight"],
                      additionalProperties: false
                    },
                    description: "4-6 seasonal demand trends throughout the year"
                  },
                  competitorInsights: {
                    type: "string",
                    description: "Analysis of competitor landscape (at least 60 words) — who the main competitors are, their strengths/weaknesses, and how this artisan can differentiate"
                  },
                  marketingTips: {
                    type: "array",
                    items: { type: "string" },
                    description: "5-7 specific, actionable marketing tips tailored to this craft type for international sales"
                  },
                  exportReadiness: {
                    type: "string",
                    description: "Brief overview (40-60 words) of export considerations: packaging, shipping, certifications, or customs tips relevant to this product"
                  }
                },
                required: ["topMarkets", "trendingKeywords", "buyerPersona", "pricingRange", "seasonalTrends", "competitorInsights", "marketingTips", "exportReadiness"],
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
