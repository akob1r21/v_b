async function finalTest() {
    const mistake = "I thought I could finish this in 5 minutes, but it took 2 hours."
    console.log(`💀 Testing Final response for: "${mistake}"`)

    try {
        const response = await fetch('http://localhost:3000/api/bury', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Session-Id': 'final-test-session'
            },
            body: JSON.stringify({ mistake })
        })

        const data = await response.json()

        if (data.ai_generated) {
            console.log("✅ AI RESPONSED SUCCESSFULLY!")
            console.log("-----------------------------------")
            console.log(`Epitaph: ${data.epitaph}`)
            console.log(`Cause of Death: ${data.causeOfDeath}`)
            console.log(`Eulogy: ${data.eulogy}`)
            console.log("-----------------------------------")
        } else {
            console.log("⚠️  AI FAILED - Used static fallback.")
        }
    } catch (e) {
        console.error("Test failed:", e.message)
    }
}

finalTest()
