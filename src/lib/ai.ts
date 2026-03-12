/**
 * Sanitizes and repairs common AI-generated JSON errors:
 * - Removes markdown code blocks
 * - Fixes literal newlines inside string values
 * - Escapes backslashes that aren't part of a valid escape sequence
 * - Removes trailing commas
 */
function sanitizeJson(text: string): string {
    let sanitized = text.trim();

    // 1. Remove markdown code blocks if present
    if (sanitized.startsWith("```")) {
        sanitized = sanitized.replace(/^```[a-z]*\n/i, "").replace(/\n```$/m, "");
    }

    // 2. Extract the first { and last }
    const start = sanitized.indexOf("{");
    const end = sanitized.lastIndexOf("}");
    if (start !== -1 && end !== -1) {
        sanitized = sanitized.substring(start, end + 1);
    }

    // 3. Handle literal newlines and tabs inside quotes
    // This is tricky: we only want to replace newlines inside "..."
    // A simpler approach: replace all literal newlines with \n escape sequence if they are inside the string
    // But AI often just returns bad JSON. Let's try to fix common patterns:
    
    // Replace literal newlines with space or \n inside quoted values
    // This regex looks for text between quotes and replaces newlines
    sanitized = sanitized.replace(/"([^"\\]*(?:\\.[^"\\]*)*)"/gs, (match) => {
        return match.replace(/\n/g, "\\n").replace(/\r/g, "");
    });

    // 4. Properly escape backslashes that are not followed by a valid JSON escape character
    // Valid escapes in JSON: " \ / b f n r t uXXXX
    // We look for a backslash NOT followed by one of these, and escape it as \\
    sanitized = sanitized.replace(/\\(?!["\\\/bfnrtu])/g, "\\\\");

    // 5. Remove trailing commas before closing braces/brackets
    sanitized = sanitized.replace(/,\s*([}\]])/g, "$1");

    return sanitized;
}

export async function generateAIResponse(prompt: string, images: string[]) {
    const apiKey = (process.env.OPENROUTER_API_KEY || '').replace(/^["']|["']$/g, '');
    if (!apiKey) {
        throw new Error("Server AI configuration is missing: OPENROUTER_API_KEY is not defined in your environment (.env.local).");
    }

    const imageContent = images.map((imgBase64: string) => {
        const base64Data = imgBase64.includes('base64,') ? imgBase64 : `data:image/jpeg;base64,${imgBase64}`;
        return {
            type: "image_url",
            image_url: { url: base64Data }
        };
    });

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
            "X-Title": "Qala Artisan Muse"
        },
        body: JSON.stringify({
            model: "google/gemini-2.0-flash-001",
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: prompt },
                        ...imageContent
                    ]
                }
            ],
            response_format: { type: "json_object" }
        })
    });

    if (!response.ok) {
        let errText = await response.text();
        try {
            const parsed = JSON.parse(errText);
            errText = parsed.error?.message || JSON.stringify(parsed);
        } catch { }
        throw new Error(`OpenRouter API Error: ${errText}`);
    }

    const result = await response.json();
    let text = result.choices?.[0]?.message?.content || "";

    if (!text) throw new Error("OpenRouter AI returned an empty response.");

    const sanitized = sanitizeJson(text);
    
    try {
        return JSON.parse(sanitized);
    } catch (parseError: any) {
        console.error("JSON parsing failed despite sanitization.");
        console.error("Raw Text:", text);
        console.error("Sanitized Text:", sanitized);
        
        // Final fallback: try a very aggressive sanitization if it's still failing
        try {
            const aggressive = sanitized
                .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Remove control characters
                .replace(/\\(?!["\\\/bfnrtu])/g, "\\\\"); // Escape backslashes that are not valid escapes
            return JSON.parse(aggressive);
        } catch (finalError: any) {
            throw new Error(`AI Parsing failed: ${parseError.message}`);
        }
    }
}
