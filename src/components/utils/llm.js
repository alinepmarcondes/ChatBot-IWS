const path = require('path');
const axios = require('axios');
const LMStudioClient = require('@lmstudio/sdk');
const ChromaClient = require('chromadb').Client;
const ChromaSettings = require('chromadb').Settings;

// Function to get text embeddings
async function getTextEmbeddings(text, modelIdentifier, serverUrl = 'http://localhost:1234') {
    const endpoint = `${serverUrl}/v1/embeddings`;
    const headers = {
        "Content-Type": "application/json"
    };
    const payload = {
        "input": text,
        "model": modelIdentifier
    };

    try {
        const response = await axios.post(endpoint, payload, { headers });
        if (response.status === 200) {
            return response.data.data[0].embedding;
        } else {
            console.error(`Error: ${response.status}, ${response.data}`);
            return null;
        }
    } catch (error) {
        console.error(`Error: ${error}`);
        return null;
    }
}

function loadEmbeddings(jsonPath) {
    // Using require to load the JSON data
    const metadata = require(jsonPath);

    const embeddings = metadata.map((data, idx) => ({
        embedding: data.embedding,
        id: data.id,
        metadata: data.metadata
    }));

    return embeddings;
}

// Function to initialize Chroma and insert embeddings
async function initializeChromaAndInsertEmbeddings(embeddings) {
    const settings = new ChromaSettings();
    const client = new ChromaClient(settings);
    const collection = await client.createCollection('iws_sistemas', true);

    for (const record of embeddings) {
        await collection.add({
            embeddings: [record.embedding],
            ids: [record.id],
            metadatas: [record.metadata]
        });
    }

    return collection;
}

// Function to query Chroma collection
async function queryChromaCollection(collection, queryEmbedding, topK = 5) {
    const results = await collection.query({
        query_embeddings: [queryEmbedding],
        n_results: topK
    });
    return results;
}

async function llm(userInput) {
    const modelIdentifier = "nomic-ai/nomic-embed-text-v1.5-GGUF/nomic-embed-text-v1.5.Q5_K_M.gguf";

    // Load embeddings from files
    const jsonPath = path.resolve(__dirname, './embeddings.json');
    const embeddings = loadEmbeddings(jsonPath);

    // Initialize Chroma and insert embeddings
    const collection = await initializeChromaAndInsertEmbeddings(embeddings);

    // Get the embedding of the user input
    const userInputEmbedding = await getTextEmbeddings(userInput, modelIdentifier);

    // Query the Chroma collection to find the most relevant context
    const results = await queryChromaCollection(collection, userInputEmbedding);
    const context = results.metadatas[0].map(metadata => metadata.content || '').join('\n').replace(/\n\n/g, '\n').replace(/=/g, '');

    const client = new LMStudioClient();

    const model = await client.llm.load("NikolayKozloff/Llama-3-portuguese-Tom-cat-8b-instruct-Q6_K-GGUF", {
        config: { gpuOffload: "max" },
        verbose: false,
        onProgress: (progress) => {
            console.log(`Progress: ${(progress * 100).toFixed(1)}%`);
        },
    });

    const prediction = model.respond(
        [
            { role: "system", content: `Responda à pergunta com base apenas no seguinte contexto, quando houver instrução, informe a instrução: ${context}`},
            { role: "user", content: userInput },
        ],
        {
            contextOverflowPolicy: "rollingWindow",
            maxPredictedTokens: 200,
            stopStrings: ["\n"],
            temperature: 0.7,
            inputPrefix: "Q: ",
            inputSuffix: "\nA:",
        },
    );

    let response = "";
    for await (const fragment of prediction) {
        response += fragment;
    }
    return response;
}

module.exports = llm;
