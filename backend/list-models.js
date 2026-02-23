import "dotenv/config"
import { GoogleGenerativeAI } from '@google/generative-ai'

async function listModels() {
    const key = process.env.GEMINI_API_KEY
    if (!key) {
        console.error("No API key found")
        return
    }
    console.log("Listing models with key:", key.substring(0, 10) + "...")

    try {
        const genAI = new GoogleGenerativeAI(key)
        // Note: listModels is usually through a different path or client in some versions, 
        // but for @google/generative-ai, it might not be directly in the main class if it's meant for simple generateContent.
        // Actually, the standard API has a listModels endpoint.
        // Let's try to just fetch the list directly if the SDK doesn't expose it easily.
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`)
        const data = await response.json()
        if (data.models) {
            console.log("Available Models:")
            data.models.forEach(m => console.log(`- ${m.name} (${m.displayName})`))
        } else {
            console.log("No models found or error:", JSON.stringify(data))
        }
    } catch (e) {
        console.error("Failed to list models:", e.message)
    }
}

listModels()
