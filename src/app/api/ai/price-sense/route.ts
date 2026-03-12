import { NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/ai';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { images, craftType } = body;
        const prompt = `
            You are a market analyst for Indian handmade exports.
            Analyze the product image. Craft Type: ${craftType || 'Artisan Craft'}
            
            Tasks:
            1. Suggest a fair market price range in Indian Rupees (₹).
            2. Estimate the current demand level (Low/Medium/High/Very High).
            3. Provide a market category and 3 reasons for the suggested price.
            
            Response MUST be JSON:
            { "priceRange": "₹700 - ₹900", "demandLevel": "High", "category": "Handmade Decor", "reasons": ["Reason 1", "Reason 2", "Reason 3"] }
        `;
        const data = await generateAIResponse(prompt, images || []);
        return NextResponse.json({ status: 'success', data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
