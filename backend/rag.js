// File: routes/rag.js

const express = require('express');
const initializeChromaAndInsertEmbeddings = require('../initializeChroma');
const queryChromaCollection = require('../queryChroma');
const { get_text_embeddings } = require('./your-embedding-and-query-functions');  // Ensure to import your functions
const OpenAI = require('openai');

const router = express.Router();

router.post('/generate-response', async (req, res) => {
    const { question } = req.body;
    const modelIdentifier = 'your-model-identifier'; // Replace with your actual model identifier

    try {
        // Generate embeddings for the question
        const questionEmbedding = await get_text_embeddings(question, modelIdentifier);

        // Initialize Chroma and insert embeddings if not already done
        const collection = await initializeChromaAndInsertEmbeddings();

        // Query Chroma collection to get context
        const results = await queryChromaCollection(collection, questionEmbedding);
        const context = results.metadatas[0]
            .map(metadata => metadata.content || '')
            .join('\n')
            .replace(/\n\n/g, '\n')
            .replace(/=/g, '');

        // Define the prompt template
        const prompt = `Responda à pergunta com base apenas no seguinte contexto:
        ${context}

        Questão: ${question}
        `;

        // Generate response using LM Studio
        const client = new OpenAI({ baseURL: "http://localhost:1234/v1", apiKey: "lm-studio" });
        const completion = await client.chat.completions.create({
            model: "mlabonne/gemma-7b-it-GGUF",
            messages: [
                { role: "system", content: `Responda à pergunta com base apenas no seguinte contexto, quando houver instrução, informe a instrução: ${context}` },
                { role: "user", content: `Pergunta: ${question}` }
            ],
            temperature: 0.7,
        });

        // Stream response back to the client
        const responseMessage = completion.choices[0].message;
        res.json({ response: responseMessage });

    } catch (error) {
        console.error('Error generating response:', error);
        res.status(500).send('Error generating response');
    }
});

module.exports = router;
