// 1. TENTO ŘÁDEK MUSÍ BÝT ÚPLNĚ NAHOŘE!
require('dotenv').config(); 

const express = require('express');
const Groq = require('groq-sdk');

const app = express();
const port = 3000;

// 2. Načtení klíče z proměnné prostředí
const apiKey = process.env.GROQ_API_KEY;

// Kontrola, jestli se klíč načetl
if (!apiKey) {
    console.error("CHYBA: Nenašel jsem GROQ_API_KEY v souboru .env!");
    process.exit(1); // Ukončí aplikaci, protože bez klíče to nemá smysl
}

// Inicializace Groq s načteným klíčem
const groq = new Groq({ apiKey: apiKey });

app.use(express.json());
app.use(express.static(__dirname));

app.post('/chat', async (req, res) => {
    const { history } = req.body;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: history,
            model: "llama-3.3-70b-versatile", // Zde případně změň na tvůj Llama model
            temperature: 0.7,
            max_tokens: 1024,
        });

        const responseText = chatCompletion.choices[0]?.message?.content || "Model nevrátil odpověď.";
        res.json({ response: responseText });

    } catch (error) {
        console.error('Groq API Error:', error);
        res.status(500).json({ error: `Chyba Groq API: ${error.message}` });
    }
});

app.listen(port, () => {
    console.log(`Groq Server běží na http://localhost:${port}`);
    console.log(`Bezpečnost: API klíč je načten ze souboru .env `);
});