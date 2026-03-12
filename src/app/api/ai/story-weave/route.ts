import { NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/ai';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { images, context } = body;
        const prompt = `
            You are a historian and master storyteller for Indian crafts.
            Analyze the product images and context: ${JSON.stringify(context || {})}
            
            Tasks:
            1. Generate a rich, poetic, and historically accurate story about this craft's lineage.
            2. Describe the traditional materials and the artisan's connection to them.
            3. Provide a high-end product description for luxury markets.
            
            Response MUST be JSON:
            { "story": "Long poetic story", "description": "Luxury description", "title": "Artistic Name" }
        `;
        const data = await generateAIResponse(prompt, images || []);
        return NextResponse.json({ status: 'success', data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
