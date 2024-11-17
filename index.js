import axios from 'axios'
import cors from 'cors'
import express from 'express'

const app = express()
app.use(express.json())
app.use(
    cors({
        origin: '*',
        methods: ['POST'],
        credentials: true,
    }),
)

app.post('/ai', async (req, res) => {
    const { prompt } = req.body
    try {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
        })

        const response = await axios.post(
            'http://localhost:11434/api/generate',
            {
                model: 'llama3',
                prompt,
                stream: true,
            },
            {
                responseType: 'stream',
            },
        )

        response.data.on('data', (data) => {
            try {
                const message = JSON.parse(data.toString())
                res.write(JSON.stringify(message))
            } catch (error) {
                console.log(`Error on parsing data: ${error}`)
            }
        })

        response.data.on('end', () => {
            res.end()
        })

        response.data.on('error', (err) => {
            console.log(`Error on stream: ${err}`)
            res.status(500).send(err.message)
        })
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})
