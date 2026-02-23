import "dotenv/config"
import { GoogleGenerativeAI } from '@google/generative-ai'

async function testPro() {
    const key = process.env.GEMINI_API_KEY
    try {
        const genAI = new GoogleGenerativeAI(key)
        const model = genAI.getGenerativeModel({ model: "gemini-pro" })
        const result = await model.generateContent("test")
        console.log("gemini-pro works!")
    } catch (e) {
        console.error("gemini-pro failed:", e.message)
    }
}

testPro()
