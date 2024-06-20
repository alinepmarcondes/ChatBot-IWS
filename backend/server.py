from flask import Flask, request, jsonify
import json
import requests
from typing import List, Dict
from chromadb import Client
from chromadb.config import Settings

app = Flask(__name__)

user_input_question = ""  # Global variable to hold user input question
model_identifier = "nomic-ai/nomic-embed-text-v1.5-GGUF/nomic-embed-text-v1.5.Q5_K_M.gguf"
json_path = './embeddings.json'

# Functions for embedding retrieval and OpenAI completion

def get_text_embeddings(text: str, model_identifier: str, server_url: str = 'http://localhost:1234') -> List[float]:
    endpoint = f"{server_url}/v1/embeddings"
    headers = {
        "Content-Type": "application/json"
    }
    payload = {
        "input": text,
        "model": model_identifier
    }
    
    response = requests.post(endpoint, headers=headers, data=json.dumps(payload))
    
    if response.status_code == 200:
        return response.json()['data'][0]['embedding']
    else:
        print(f"Error: {response.status_code}, {response.text}")
        return None

def load_embeddings(json_path: str) -> List[Dict]:
    with open(json_path, 'r') as json_file:
        metadata = json.load(json_file)

    embeddings = []
    for idx, data in enumerate(metadata):
        embeddings.append({
            'embedding': data['embedding'],
            'id': data['id'],
            'metadata': data['metadata']
        })

    return embeddings

def initialize_chroma_and_insert_embeddings(embeddings: List[Dict]):
    settings = Settings()
    client = Client(settings=settings)
    collection = client.create_collection(name="iws_sistemas", get_or_create=True)

    for record in embeddings:
        collection.add(
            embeddings=[record['embedding']],
            ids=[record['id']],
            metadatas=[record['metadata']]
        )

    return collection

def query_chroma_collection(collection, query_embedding: List[float], top_k: int = 5):
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k
    )
    return results

# Initialize Chroma and insert embeddings
embeddings = load_embeddings(json_path)
collection = initialize_chroma_and_insert_embeddings(embeddings)

# Flask route to handle POST requests
@app.route('/process_question', methods=['POST'])
def process_question():
    global user_input_question
    user_input_question = request.json['user_input_question']  # Assuming input JSON format {"user_input_question": "your question here"}

    question_embedding = get_text_embeddings(user_input_question, model_identifier)
    results = query_chroma_collection(collection, question_embedding)

    context = "\n".join([metadata.get('content', '') for metadata in results.get('metadatas', [[]])[0]])
    context = context.replace('\n\n', '\n').replace('=', '')

    return jsonify(context)

if __name__ == '__main__':
    app.run(port=5050)