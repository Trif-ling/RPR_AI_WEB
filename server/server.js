// server.js
require('dotenv').config();
const express = require('express');
const Groq = require('groq-sdk');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const port = 3001;

const apiKey = process.env.GROQ_API_KEY;
if (!apiKey) {
    console.error("CHYBA: Nenašel jsem GROQ_API_KEY v souboru .env!");
    process.exit(1);
}

const groq = new Groq({ apiKey: apiKey });

app.use(cors());
app.use(express.json());

const chatLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // Časové okno: 15 minut
    max: 15, // 15 požadavků za 15 minut z jedné IP adresy
    standardHeaders: true,
    legacyHeaders: false,
    message: async (request, response) => {
        response.status(429).json({
            error: "Limit zpráv překročen. Zkuste to prosím za 15 minut znovu.",
        });
    },
});

app.post('/chat', chatLimiter, async (req, res) => {
    const { history } = req.body;

    // Nastavení hlaviček pro streamování
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Connection', 'keep-alive'); // Doporučeno pro stabilní stream

    try {
        const stream = await groq.chat.completions.create({
            messages: history,
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 1024,
            stream: true,
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
                res.write(content);
            }
        }

        res.end();

    } catch (error) {
        console.error('Groq API Error:', error);
        res.write(`\n[CHYBA SERVERU: ${error.message}]`);
        res.end();
    }
});

app.listen(port, () => {
    console.log(`Backend běží na http://localhost:${port}`);
});