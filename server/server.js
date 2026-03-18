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
    windowMs: 30 * 60 * 1000,
    max: 50,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        // Pokud někdo obelstí frontend, tady narazí
        res.status(429).json({
            error: "Bezpečnostní limit serveru překročen. Zkuste to prosím za 30 minut."
        });
    }
});

app.post('/chat', chatLimiter, async (req, res) => {
    const { history, modelId } = req.body;
    // Nastavení hlaviček pro streamování
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Cache-Control', 'no-cache, no-transform'); 
    res.setHeader('X-Accel-Buffering', 'no'); 
    res.flushHeaders();

    try {
        const modelToUse = modelId ? modelId : "llama-3.3-70b-versatile";

        const stream = await groq.chat.completions.create({
            messages: history,
            model: modelToUse,
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