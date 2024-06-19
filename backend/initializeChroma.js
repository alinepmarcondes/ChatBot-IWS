// File: initializeChroma.js

const { Client, Settings } = require('chroma-js');
const embeddings = require('./loadEmbeddings');

const initializeChromaAndInsertEmbeddings = async () => {
    const settings = new Settings();
    const client = new Client({ settings });
    const collection = await client.createCollection('iws_sistemas', { getOrCreate: true });

    for (const record of embeddings) {
        await collection.add({
            embeddings: [record.embedding],
            ids: [record.id],
            metadatas: [record.metadata],
        });
    }

    return collection;
};

module.exports = initializeChromaAndInsertEmbeddings;