import { Router, Request, Response } from 'express';
import { OpenRouter } from '@openrouter/sdk';

const router = Router();

// Configuration
const apiKey = (process.env.OPENROUTER_API_KEY || '').replace(/^["']|["']$/g, '');

// Initialize OpenRouter SDK
let openRouter: OpenRouter;
if (apiKey) {
    console.log("Initializing OpenRouter AI");
    openRouter = new OpenRouter({
        apiKey: apiKey,
    });
} else {
    console.error("WARNING: OPENROUTER_API_KEY is missing in environment variables.");
}

// Helper to call AI and parse JSON
async function generateAIResponse(prompt: string, images: string[]) {
    if (!openRouter) throw new Error('Server AI configuration is missing');

    const imageContent = images.map((imgBase64: string) => {
        const base64Data = imgBase64.includes('base64,') ? imgBase64 : `data:image/jpeg;base64,${imgBase64}`;
        return {
            type: "image_url" as const,
            imageUrl: { url: base64Data }
        };
    });

    const result = await openRouter.chat.send({
        chatGenerationParams: {
            model: "google/gemini-2.0-flash-001",
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: prompt },
                        ...imageContent as any
                    ]
                }
            ],
            responseFormat: { type: "json_object" }
        }
    });

    let text = "";
    if (typeof (result as any)[Symbol.asyncIterator] === 'function') {
        for await (const chunk of result as any) {
            text += chunk.choices[0]?.delta?.content || "";
        }
    } else {
        text = (result as any).choices?.[0]?.message?.content || "";
    }

    if (!text) throw new Error("OpenRouter returned an empty response.");
    return JSON.parse(text);
}

// 1. STORY WEAVE - Focused on Deep Historical Stories
router.post('/story-weave', async (req: Request, res: Response) => {
    try {
        const { images, context } = req.body;
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
        res.json({ status: 'success', data });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// 2. PRICE SENSE - Market Analytics & Pricing
router.post('/price-sense', async (req: Request, res: Response) => {
    try {
        const { images, craftType } = req.body;
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
        res.json({ status: 'success', data });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// 3. CRAFT BOOST - Marketing & Social Media
router.post('/craft-boost', async (req: Request, res: Response) => {
    try {
        const { images } = req.body;
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
        res.json({ status: 'success', data });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// 4. GENERATE POST - (Original general endpoint)
router.post('/generate-post', async (req: Request, res: Response) => {
    try {
        const { images, context } = req.body;
        const prompt = `
            Identify craft, generate title, historical story, description, 5 hashtags, 3 taglines, and reel script.
            Context: ${JSON.stringify(context || {})}
            Response MUST be JSON.
        `;
        const data = await generateAIResponse(prompt, images || []);
        res.json({ status: 'success', data });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
