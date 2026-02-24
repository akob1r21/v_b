async function testBury(mistake, testName) {
    console.log(`💀 Testing ${testName}: "${mistake}"`)

    try {
        const response = await fetch('http://localhost:3000/api/bury', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Session-Id': 'test-session'
            },
            body: JSON.stringify({ mistake })
        })

        const data = await response.json()
        // console.log("Response:", JSON.stringify(data, null, 2))

        if (data.ai_generated) {
            console.log(`✅ AI Generation worked for ${testName}!`)
            console.log(`   Epitaph: ${data.epitaph}`)
        } else {
            console.log(`⚠️  AI Generation failed for ${testName}, used static fallback.`)
        }
    } catch (e) {
        console.error(`Test failed for ${testName}:`, e.message)
    }
}

async function runTests() {
    await testBury("I forgot to save my work and lost 4 hours of progress.", "English Mistake")
    await testBury("Я забыл сохранить работу и потерял 4 часа прогресса.", "Russian Mistake")
}

runTests()
