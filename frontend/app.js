const app = document.getElementById('app')
const promptInputEl = document.getElementById('prompt')
const sendPromptButtonEl = document.querySelector('button')

async function request(prompt) {
    const response = await fetch('http://localhost:3000/ai', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
    })

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
        const { done, value } = await reader.read()
        if (done) {
            break
        }
        buffer += decoder.decode(value)
    }

    const parseResponseToJson = parseStreamData(buffer)
    let result = ''
    for (const text of parseResponseToJson) {
        result += text.response
    }
    app.innerText = result
}

function parseStreamData(data) {
    const jsonParts = data.match(/{[^{}]*}/g)
    if (!jsonParts) {
        console.error('Não foi possível encontrar objetos JSON na string')
        return
    }
    const parsedObjects = jsonParts.map((part) => JSON.parse(part))
    return parsedObjects
}

sendPromptButtonEl.addEventListener('click', (event) => {
    event.preventDefault()
    app.innerText = 'Loading...'
    const prompt = promptInputEl.value
    request(prompt)
    promptInputEl.value = ''
})
