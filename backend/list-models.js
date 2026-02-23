import "dotenv/config"
import { GoogleGenerativeAI } from '@google/generative-ai'

async function listModels() {
    const key = process.env.GEMINI_API_KEY
    if (!key) {
        console.error("No API key found")
        return
    }

    try {
        const genAI = new GoogleGenerativeAI(key)
        // Note: The SDK might not expose a direct listModels, so we check documentation or use a generic model attempt
        console.log("Listing models is not directly available in standard SDK without extra calls, trying gemini-1.5-flash-latest...")
        const model = genAI.getGenerativeModel({ model: "gemini-pro" })
        const result = await model.generateContent("test")
        console.log("gemini-1.5-flash-latest works!")
    } catch (e) {
        console.error("Test failed:", e.message)
    }
}

listModels()
