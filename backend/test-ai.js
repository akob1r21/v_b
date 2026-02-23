import "dotenv/config"
import { GoogleGenerativeAI } from '@google/generative-ai'

async function testAI() {
    const key = process.env.GEMINI_API_KEY
    if (!key) {
        console.error("No API key found")
        return
    }
    console.log("Testing with key:", key.substring(0, 10) + "...")

    try {
        const genAI = new GoogleGenerativeAI(key)
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" })
        const result = await model.generateContent("Hello, respond with a joke about a cat and JSON.")
        const response = await result.response
        console.log("Response:", response.text())
    } catch (e) {
        console.error("AI Test Failed:", e.message)
    }
}

testAI()
