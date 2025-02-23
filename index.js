import axios from 'axios'
import cors from 'cors'
import express from 'express'

const app = express()
const API_URL = 'http://localhost:11434/api/generate'
const PORT = 3001

app.use(express.json())
app.use(
    cors({
        origin: '*',
        methods: ['POST'],
        credentials: true,
    }),
)

app.get('/health', (req, res) => {
    res.send({ 200: 'ok' })
})

app.post('/ai', async (req, res) => {
    const { prompt } = req.body
    const headers = {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
    }
    const payload = {
        model: 'llama3',
        prompt,
        stream: true,
    }
    try {
        const response = await axios.post(API_URL, payload, {
            responseType: 'stream',
        })
        response.data.pipe(res)
        response.data.on('end', () => {
            res.end()
        })
        response.data.on('error', err => {
            console.error('Erro no stream:', err)
            res.status(500).send('Erro no stream')
        })
        res.writeHead(200, headers)
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
})

app.listen(PORT, _ => console.log(`Server is running on port ${PORT}`))
