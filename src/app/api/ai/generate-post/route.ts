import { NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/ai';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { images, context } = body;
        const prompt = `
            Identify the Indian craft in the images and generate marketing content.
            Context: ${JSON.stringify(context || {})}
            You MUST return exactly this JSON structure (and nothing else). 
            CRITICAL: Ensure the JSON is strictly valid. Do NOT include unescaped newlines, unescaped quotes, or bad escaped characters inside the string values. All strings must be properly escaped.
            {
                "detectedCraft": "Name of the craft",
                "title": "A catchy product title",
                "description": "A compelling product description",
                "story": "Historical or cultural story behind the craft",
                "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
                "taglines": ["Tagline 1", "Tagline 2", "Tagline 3"],
                "reelScript": "A short script for an Instagram reel"
            }
        `;
        const data = await generateAIResponse(prompt, images || []);
        return NextResponse.json({ status: 'success', data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
