import { createServer } from 'node:http'

const hostname = 'localhost'
const port = 3000

let count = 0

async function bitcoinAPI(currency) {
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=${currency}`)
    const data = await response.json()
    return data
}

const server = createServer(async (req, res) => {
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
        // Verificando se o Content-Type é application/json
        if (req.headers['content-type'] !== 'application/json') {
            res.writeHead(415); // 415 = Unsupported Media Type
            return res.end(JSON.stringify({ error: 'Only application/json is allowed.' }));
        }

        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const parsedBody = JSON.parse(body);

                // validando se o input é número com regex
                if (!/^\d+$/.test(parsedBody.incrementBy)) {
                    throw new Error('Invalid input');
                }

                count = count + Number(parsedBody.incrementBy)

                res.writeHead(200);
                res.end(JSON.stringify({ counter: count }));
            } catch (error) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: error.message }))
            }
        });
    } else if (url.pathname === '/stock-insight' && method === 'GET') {
        try {
            // capturando query params para obter a currency
            const queryParams = Object.fromEntries(url.searchParams);
            const currency = queryParams.currency || 'usd';

            // validando a currency passada na url
            if (!['usd', 'brl'].includes(currency)) {
                throw new Error('Invalid Currency');
            }

            // obtendo os dados da API do bitcoin
            const data = await bitcoinAPI(currency);
            const btcPrice = data.bitcoin[currency];

            // definindo a sugestão com base no preço
            const suggestion = currency === 'brl'
                ? btcPrice < 300000 ? 'Bom momento para compra!'
                    : btcPrice <= 450000 ? 'Preço razoável. Avalie antes de comprar.'
                        : 'Bitcoin está caro. Pode ser melhor esperar.'
                : btcPrice < 60000 ? 'Bom momento para compra!'
                    : btcPrice <= 80000 ? 'Preço razoável. Avalie antes de comprar.'
                        : 'Bitcoin está caro. Pode ser melhor esperar.';

            res.writeHead(200);
            res.end(JSON.stringify({ btc_price: btcPrice, currency, suggestion }));
        } catch (error) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: error.message }))
        }
    }
})

server.listen(port, hostname, () => {
    console.log(`Server is running at http://${hostname}:${port}`)
})