import "dotenv/config"
import Groq from "groq-sdk"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

async function listModels() {
    try {
        const models = await groq.models.list()
        console.log("Available Groq Models:")
        models.data.forEach(m => console.log(`- ${m.id}`))
    } catch (e) {
        console.error("Failed to list models:", e.message)
    }
}

listModels()
