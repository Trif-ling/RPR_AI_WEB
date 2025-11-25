// server.js
require('dotenv').config();
const express = require('express');
const Groq = require('groq-sdk');
const cors = require('cors'); // Nové: Povolení komunikace s Reactem

const app = express();
const port = 3001; // Změna portu na 3001 (React většinou běží na 3000)

const apiKey = process.env.GROQ_API_KEY;
if (!apiKey) {
    console.error("CHYBA: Nenašel jsem GROQ_API_KEY v souboru .env!");
    process.exit(1);
}

const groq = new Groq({ apiKey: apiKey });

// Povolit CORS pro všechny requesty (nebo specifikuj 'http://localhost:3000')
app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
    const { history } = req.body;

    // Nastavení hlaviček pro streamování
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    try {
        const stream = await groq.chat.completions.create({
            messages: history, // React nám pošle správný formát
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