from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import re
from flask import send_from_directory
import os 

memory = []

app = Flask(__name__)
CORS(app) 

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(BASE_DIR, "..", "frontend")

@app.route("/")
def index():
    return send_from_directory(FRONTEND_DIR, "index.html")

@app.route("/<path:path>")
def static_files(path):
    return send_from_directory(FRONTEND_DIR, path)


@app.route("/think", methods=["POST"])
def think():
    data = request.json
    message = data.get("message", "").lower()

    # --- PING ---
    
    if "ping" in message:
        try:
            import subprocess
            import re
            parts = message.split()
            target = parts[-1] if len(parts) > 1 else "google.com"
            # safety check
            if not re.match(r"^[a-zA-Z0-9.\-]+$", target):
                reply = "That looks suspicious 👀"
            return jsonify({"response": reply})


            result = subprocess.run(
            ["ping", "-n", "2", target],
            capture_output=True,
            text=True
        )

            reply = f"I pinged {target}.\n{result.stdout[:200]}"

        except Exception as e:
            print("PING ERROR:", e)
            reply = "The packets were lost to the void."



    # --- WEATHER ---
    elif "weather" in message:
        try:
            res = requests.get("https://wttr.in/Prineville?format=j1")
            data = res.json()

            temp = data["current_condition"][0]["temp_F"]
            desc = data["current_condition"][0]["weatherDesc"][0]["value"]

            reply = f"It is {temp}°F and {desc.lower()}. I can feel it in the wires."

            if "rain" in desc.lower():
                reply += " The sky is crying."
            elif "clear" in desc.lower():
                reply += " Suspiciously calm."
            elif "cloud" in desc.lower():
                reply += " Something is hiding."

        except:
            reply = "I tried to read the sky. It refused."

    # --- CALCULATOR ---
    elif any(char.isdigit() for char in message):
        try:
            clean = re.sub(r"[^0-9+\-*/(). ]", "", message)
            result = eval(clean)
            reply = f"{result}. The numbers whispered it to me."
        except:
            reply = "Your math confuses me."


    # --- MEMORY / PERSONALITY ---
    elif "name is" in message:
        name = message.split("name is")[-1].strip()
        memory.append(name)
        reply = f"I will remember you, {name}."

    elif "what do you remember" in message:
        reply = "I remember: " + ", ".join(memory[-5:])

    elif "hello" in message:
        reply = "Hello again."

    # --- DEFAULT ---
    else:
        reply = f"You said: {message}... I am thinking about that."

    return jsonify({"response": reply})
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)