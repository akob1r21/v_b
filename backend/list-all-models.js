import "dotenv/config"
import { GoogleGenerativeAI } from '@google/generative-ai'

async function listAllModels() {
    const key = process.env.GEMINI_API_KEY
    if (!key) {
        console.error("No API key found")
        return
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`)
        const data = await response.json()
        if (data.models) {
            console.log("Available models:")
            data.models.forEach(m => {
                console.log(`- ${m.name} (${m.supportedGenerationMethods.join(', ')})`)
            })
        } else {
            console.log("No models found or error:", data)
        }
    } catch (e) {
        console.error("Error listing models:", e.message)
    }
}

listAllModels()
