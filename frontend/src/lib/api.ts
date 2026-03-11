const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
};

export const aiApi = {
    generateStory: (data: { artisan_name: string; region: string; craft_type: string }) =>
        apiFetch('/ai/generate-story', { method: 'POST', body: JSON.stringify(data) }),

    enhanceImage: (data: { image_url: string }) =>
        apiFetch('/ai/enhance-image', { method: 'POST', body: JSON.stringify(data) }),
};
