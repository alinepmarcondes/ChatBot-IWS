const { LMStudioClient } = require("@lmstudio/sdk");

async function llm() {
  try {
    const client = new LMStudioClient();
    const model = await client.llm.load("mlabonne/gemma-7b-it-GGUF",{
        config: { gpuOffload: "max" },
        verbose: false, // Disables the default progress logging
        onProgress: (progress) => {
            console.log(`Progress: ${(progress * 100).toFixed(1)}%`);
        },
    });

    const prediction = model.respond(
        [
            { role: "system", content: "Answer the following questions." },
            { role: "user", content: "What is the meaning of life?" },
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

    for await (const fragment of prediction) {
        process.stdout.write(fragment);
      }
  } catch (error) {
    console.error('Error running LM Studio example:', error);
  }
}

module.exports = llm;
