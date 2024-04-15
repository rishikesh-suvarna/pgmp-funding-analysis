from flask import Flask, request, jsonify
import tensorflow as tf
import tensorflow_hub as hub
import tensorflow_text # For Use model
import numpy as np

app = Flask(__name__)

use_model = hub.load("https://tfhub.dev/google/universal-sentence-encoder-multilingual/3")
# Define the calculate_relevance route for the API endpoint
@app.route('/calculate_relevance', methods=['POST'])
def calculate_relevance():
    # Extracting data from the request
    data = request.get_json()
    keyword = data['keyword']
    description = data['description']

    description = description.replace('"', '\\"')  # Escape double quotes
    description = description.replace("'", "\\'")  # Escape single quotes
    
    # Caling relevance calculation function
    relevance_score = calculate_relevance_function(keyword, description, use_model)

    # Converting the relevance score to a standard Python float
    if(relevance_score > 0):
        relevance_score = float(f'{relevance_score:.2f}')
    else:
        relevance_score = 0

    # Returning response as JSON
    return jsonify({'relevance_score': relevance_score})

# Function to calculate relevance
def calculate_relevance_function(keyword, description, model):
    # Encode sentences into embeddings
    embeddings = model([keyword, description])

    # Compute cosine relevance score between embeddings
    relevance_score = np.dot(embeddings[0], embeddings[1]) / (np.linalg.norm(embeddings[0]) * np.linalg.norm(embeddings[1]))

    # Return in a percentage value
    return relevance_score * 100

# Run the Flask application
if __name__ == '__main__':
    app.run(debug=True)
