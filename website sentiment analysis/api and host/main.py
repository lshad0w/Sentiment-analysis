import sklearn
from flask import Flask, request, jsonify
from flask_cors import CORS
import re
import joblib
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
import logging

nltk.download('punkt')
nltk.download('punkt_tab')
nltk.download('stopwords')
nltk.download('wordnet')

app = Flask(__name__)
CORS(app)


logging.basicConfig(level=logging.INFO)

model = joblib.load('Smodel.pkl')
vectorizer = joblib.load('vector.pkl')
lemmmatizer = WordNetLemmatizer()

def reprocess_text(text):
    text = text.lower()
    text = re.sub(r"n't", "not", text)
    tokens = word_tokenize(text)
    stop_words = set(stopwords.words('english'))
    filtered_tokens = [lemmmatizer.lemmatize(word) for word in tokens if word.isalnum() and word not in stop_words]
    return ' '.join(filtered_tokens)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        logging.info(f"Received data: {data}")  # sanity check

        if not data or 'review' not in data:
            logging.warning("Invalid request: missing 'review' field")
            return jsonify({'error': 'Invalid request: Missing review'}), 400

        review = data['review']
        processed_review = reprocess_text(review)
        vectorize_review = vectorizer.transform([processed_review])
        prediction = model.predict(vectorize_review)[0]

        sentiment_map = {0: 'Negative', 1: 'Neutral', 2: 'Positive'}

        sentiment = sentiment_map.get(prediction, 'Neutral')

        logging.info(f"Predicted sentiment: {sentiment}")
        return jsonify({'sentiment': sentiment})

    except Exception as e:
        logging.error(f"Error during prediction: {str(e)}")
        return jsonify({'error': str(e)})



#main class
app.run(port=8971, debug=True)