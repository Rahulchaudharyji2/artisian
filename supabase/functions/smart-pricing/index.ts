import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { craftType, materialType, productDescription, targetMarket } = await req.json();
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
            content: `You are a pricing strategist specializing in Indian handmade crafts and artisan goods for both domestic and international markets. Provide detailed, data-driven pricing recommendations based on craft type, materials, market demand, and global trends. Consider labor hours, material costs, perceived value, competitor pricing, and market positioning. Be specific with numbers and reasoning. You must call the create_pricing_analysis function.`
          },
          {
            role: "user",
            content: `Provide a comprehensive smart pricing analysis for:
- Craft Type: ${craftType}
- Material Type: ${materialType}
- Product Description: ${productDescription || "Not specified"}
- Target Market: ${targetMarket || "Both domestic and international"}

Give specific pricing in INR for domestic and USD for international. Factor in material costs, labor, market demand, global trends, and competitor analysis. Provide actionable pricing tiers and strategies.`
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "create_pricing_analysis",
              description: "Generate comprehensive pricing analysis for an artisan craft product",
              parameters: {
                type: "object",
                properties: {
                  recommendedPrice: {
                    type: "object",
                    properties: {
                      domestic: { type: "string", description: "Recommended price range in INR for Indian market e.g. '₹800 – ₹1,500'" },
                      international: { type: "string", description: "Recommended price range in USD for international market e.g. '$25 – $45'" },
                      wholesale: { type: "string", description: "Wholesale/bulk pricing in INR e.g. '₹500 – ₹900 per unit (min 10 units)'" }
                    },
                    required: ["domestic", "international", "wholesale"],
                    additionalProperties: false
                  },
                  pricingTiers: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        tier: { type: "string", description: "Tier name e.g. 'Basic', 'Premium', 'Luxury'" },
                        priceRange: { type: "string", description: "Price range for this tier in INR" },
                        features: { type: "string", description: "What differentiates this tier — size, finish, customization, packaging etc." }
                      },
                      required: ["tier", "priceRange", "features"],
                      additionalProperties: false
                    },
                    description: "3 pricing tiers (basic, premium, luxury) with clear differentiation"
                  },
                  costBreakdown: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        component: { type: "string", description: "Cost component name e.g. 'Raw Materials', 'Labor', 'Packaging'" },
                        estimatedCost: { type: "string", description: "Estimated cost in INR" },
                        percentage: { type: "number", description: "Percentage of total cost" }
                      },
                      required: ["component", "estimatedCost", "percentage"],
                      additionalProperties: false
                    },
                    description: "5-7 cost components that make up the product price"
                  },
                  marketDemand: {
                    type: "string",
                    description: "Detailed analysis (80+ words) of current market demand for this craft type — trending or declining, buyer interest levels, seasonal patterns, and demand drivers"
                  },
                  globalTrends: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        trend: { type: "string", description: "Trend name" },
                        impact: { type: "string", description: "How this trend affects pricing — positive or negative, and by how much" }
                      },
                      required: ["trend", "impact"],
                      additionalProperties: false
                    },
                    description: "4-6 global trends affecting the pricing of this craft"
                  },
                  competitorPricing: {
                    type: "string",
                    description: "Analysis (60+ words) of how competitors price similar products on platforms like Etsy, Amazon Handmade, and local Indian marketplaces"
                  },
                  pricingStrategy: {
                    type: "string",
                    description: "Recommended pricing strategy (80+ words) — value-based, cost-plus, or premium positioning with specific reasoning and tips for maximizing profit"
                  },
                  profitMargin: {
                    type: "string",
                    description: "Expected profit margin percentage and explanation e.g. '45-60% margin after materials and labor'"
                  }
                },
                required: ["recommendedPrice", "pricingTiers", "costBreakdown", "marketDemand", "globalTrends", "competitorPricing", "pricingStrategy", "profitMargin"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "create_pricing_analysis" } }
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
    console.error("smart-pricing error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
