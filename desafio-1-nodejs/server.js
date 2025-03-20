import { createServer } from 'node:http'

const hostname = 'localhost'
const port = 3000

const server = createServer((req, res) => {
    const { method, url } = req;

    res.setHeader('Content-Type', 'application/json')

    if (url === '/health-check' && method === 'GET') {
        res.writeHead(200)
        res.end(JSON.stringify({ success: true, timeStamp: new Date().toISOString() }))
    }
})

server.listen(port, hostname, () => {
    console.log(`Server is running at http://${hostname}:${port}`)
})