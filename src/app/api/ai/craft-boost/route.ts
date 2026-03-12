import { NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/ai';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { images } = body;
        const prompt = `
            You are an expert social media manager for rural brands.
            Analyze the product images.
            
            Tasks:
            1. Generate a viral Instagram caption with emojis.
            2. Provide 10 relevant hashtags.
            3. Generate a WhatsApp message for sharing with buyers.
            4. Suggest a short "Story idea" for an engaging video.
            
            Response MUST be JSON:
            { "instagram": "Caption here", "hashtags": ["#tag1"], "whatsapp": "WhatsApp text", "storyIdea": "Video idea description" }
        `;
        const data = await generateAIResponse(prompt, images || []);
        return NextResponse.json({ status: 'success', data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
