from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer, util
from deep_translator import GoogleTranslator
from langdetect import detect
import torch


app = Flask(__name__)


model = SentenceTransformer("chatbot-python/chatbot_model")

data = torch.load("chatbot-python/faq_data.pt")
questions = data["questions"]
reponses = data["reponses"]
question_embeddings = data["embeddings"]

@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("message", "")
    if not user_input:
        return jsonify({"error": "Message vide"}), 400

    user_lang = detect(user_input)
    user_embedding = model.encode(user_input, convert_to_tensor=True)
    scores = util.pytorch_cos_sim(user_embedding, question_embeddings)[0]
    best_idx = scores.argmax().item()
    best_score = scores[best_idx].item()

    if best_score > 0.5:
        reponse_fr = reponses[best_idx]
        if user_lang != 'fr':
            try:
                reponse_traduite = GoogleTranslator(source='fr', target=user_lang).translate(reponse_fr)
                return jsonify({"response": reponse_traduite, "lang": user_lang, "translated": True})
            except Exception as e:
                return jsonify({"response": reponse_fr, "lang": "fr", "translated": False, "error": str(e)})
        else:
            return jsonify({"response": reponse_fr, "lang": "fr", "translated": False})
    else:
        return jsonify({"response": " Je ne trouve pas de réponse adaptée. Veuillez nous contacter par téléphone au 26 44 66 09 pour plus d’informations. .", "lang": user_lang})

if __name__ == '__main__':
    app.run(port=5005, debug=True)
