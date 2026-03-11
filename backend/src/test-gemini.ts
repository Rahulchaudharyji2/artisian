import { OpenRouter } from '@openrouter/sdk';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env from backend/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

const apiKeyRaw = process.env.OPENROUTER_API_KEY || '';
const apiKey = apiKeyRaw.replace(/^["']|["']$/g, '');

async function testConnection() {
    if (!apiKey) {
        console.error("❌ FAILURE: OpenRouter API Key is missing in .env");
        process.exit(1);
    }

    console.log(`Testing OpenRouter Connection: ${apiKey.substring(0, 8)}...`);
    
    try {
        const openRouter = new OpenRouter({ apiKey });
        
        console.log("Calling chat.send...");
        const result = await openRouter.chat.send({
            chatGenerationParams: {
                model: "google/gemini-2.0-flash-001",
                messages: [{ role: "user", content: "Say 'OpenRouter Success'" }]
            }
        });
        
        // Simple response handling
        let text = "";
        if (typeof (result as any)[Symbol.asyncIterator] === 'function') {
            for await (const chunk of result as any) {
                text += chunk.choices[0]?.delta?.content || "";
            }
        } else {
            text = (result as any).choices?.[0]?.message?.content || "";
        }

        console.log("Response:", text.trim());
        console.log("\n✅ SUCCESS: OpenRouter integration is working!");
    } catch (error: any) {
        console.error("\n❌ FAILURE: Test failed.");
        console.error("Error Message:", error.message);
    }
}

testConnection();
