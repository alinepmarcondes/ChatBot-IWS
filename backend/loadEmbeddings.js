// File: loadEmbeddings.js

const fs = require('fs');
const path = require('path');
const np = require('numpy');

const npyPath = './embeddings.npy';
const jsonPath = './embeddings.json';

// Load embeddings from npy file
const embeddingsArray = np.load(npyPath);

// Load metadata from json file
const metadata = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

// Combine the embeddings and metadata into a list of dictionaries
const embeddings = embeddingsArray.map((embedding, idx) => ({
    embedding: Array.from(embedding),  // Convert numpy array to list
    id: metadata[idx].id,
    metadata: metadata[idx].metadata
}));

module.exports = embeddings;
