import { createServer } from "node:http"

const hostname = "localhost"
const port = 3000

const server = createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json')
})

server.listen(port, hostname, ()=>{
    console.log(`Server is running at http://${hostname}:${port}`)
})