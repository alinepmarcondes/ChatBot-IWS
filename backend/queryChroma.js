// File: queryChroma.js

const queryChromaCollection = async (collection, queryEmbedding, topK = 5) => {
    const results = await collection.query({
        query_embeddings: [queryEmbedding],
        n_results: topK,
    });
    return results;
};

module.exports = queryChromaCollection;