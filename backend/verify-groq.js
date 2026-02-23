import "dotenv/config"
import Groq from "groq-sdk"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

async function testGroq() {
    console.log("🚀 Testing Groq AI...")
    try {
        const completion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: 'Say "Groq is working!" and return a sample JSON: {"status": "ok"}' }],
            model: 'llama-3.3-70b-versatile',
            response_format: { type: 'json_object' }
        })
        console.log("✅ Groq Response:", completion.choices[0].message.content)
    } catch (e) {
        console.error("❌ Groq Test Failed:", e.message)
    }
}

testGroq()
