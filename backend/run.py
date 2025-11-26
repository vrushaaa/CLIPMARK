from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allow React to access Flask

@app.route("/test", methods=["GET"])
def test():
    return jsonify({"message": "Backend is working!"})

if __name__ == "__main__":
    app.run(debug=True)
