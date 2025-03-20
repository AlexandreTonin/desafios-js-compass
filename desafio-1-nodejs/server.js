import { createServer } from 'node:http'

const hostname = 'localhost'
const port = 3000

const server = createServer((req, res) => {
    const { method } = req;

    const url = new URL(req.url, `http://${hostname}:${port}`)

    res.setHeader('Content-Type', 'application/json')

    if (url.pathname === '/health-check' && method === 'GET') {
        res.writeHead(200)
        res.end(JSON.stringify({ success: true, timeStamp: new Date().toISOString() }))
    } else if (url.pathname === '/is-prime-number' && method === 'GET') {
        try {
            const queryParams = Object.fromEntries(url.searchParams);

            // validando se o input é número com regex
            if (!/^\d+$/.test(queryParams.number)) {
                throw new Error('Invalid input');
            }

            // Números menores ou iguais a 1 não são primos
            if (queryParams.number <= 1) throw new Error('Is not prime')

            // 2 é o único número par primo
            if (queryParams.number == 2) {
                res.writeHead(200)
                return res.end(JSON.stringify({ isPrime: true }))
            }

            // Elimina números pares maiores que 2
            if (queryParams.number % 2 == 0) throw new Error('Is not prime')

            // Verifica divisibilidade apenas até a raiz quadrada de number
            const limit = Math.sqrt(queryParams.number)

            for (let i = 3; i <= limit; i += 2) {
                // Se for divisível, não é primo
                if (queryParams.number % i == 0) throw new Error('Is not prime')
            }

            res.writeHead(200)
            res.end(JSON.stringify({ isPrime: true }))
        } catch (error) {
            if (error.message == 'Invalid input') {
                res.writeHead(400)
                res.end(JSON.stringify({ error: error.message }))
            } else if (error.message == 'Is not prime') {
                res.writeHead(200)
                res.end(JSON.stringify({ isPrime: false }))
            }
        }
    } else if (url.pathname === '/count' && method === 'POST') {

    }
})

server.listen(port, hostname, () => {
    console.log(`Server is running at http://${hostname}:${port}`)
})