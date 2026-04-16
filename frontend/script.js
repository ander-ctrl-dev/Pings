let typingTimeout;
function speak(text) {
    const status = document.getElementById("status");

    let i = 0;
    status.textContent = "";

    function type() {
        if (i < text.length) {
            status.textContent += text[i];
            i++;
            setTimeout(type, 50);
        }
    }

    type();
}

    function type() {
    if (i < text.length) {
        status.textContent += text[i];
        i++;
        typingTimeout = setTimeout(type, 50);
    } else {
        // 👇 ONLY speak ONCE after full sentence
        // voice(text);  ← leave this commented for now (you want silence)
    }
}


function voice(text) {
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.rate = 0.9;   // speed (0.5–2)
    utterance.pitch = 0.8;  // lower = creepier
    utterance.volume = 1;

    speechSynthesis.speak(utterance);
}

function setMood(mood) {
    const face = document.getElementById("face");

    // change face
    face.textContent = faces[mood];

    // keep color styling too (optional)
    face.classList.remove("happy", "thinking", "chaotic", "needy");
    face.classList.add(mood);
}


const faces = {
    happy: "(◕‿◕)",
    thinking: "(•_•)?",
    chaotic: "(⚆_⚆)",
    needy: "(｡•́‿•̀｡)"
};


document.getElementById("face").addEventListener("click", () => {
    const face = document.getElementById("face");

    face.style.transform = "scale(0.9)";

    setTimeout(() => {
        face.style.transform = "scale(1)";
    }, 100);
});

window.onload = function () {

    const inputBox = document.getElementById("userInput");

    inputBox.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {

            const input = inputBox.value;
            let msg = input.toLowerCase();

if (msg.includes("hi") || msg.includes("hello")) {
    setMood("happy");
}
else if (msg.includes("?")) {
    setMood("thinking");
}
else if (msg.includes("no") || msg.includes("stop")) {
    setMood("needy");
}
else {
    setMood("happy");
}
if (Math.random() < 0.2) {
    setMood("chaotic");
}

            fetch("http://192.168.4.22:5000/think", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message: input })
            })
            .then(res => res.json())
            .then(data => {
                speak(data.response);
            });

            inputBox.value = "";
        }
    });

};


    const pingsThoughts = [
    "I am thinking...call the police. Or a scientist.",
    "A network is trying to hide from me.",
    "Ali, you might be a human, but you're one cool cat.",
    "I am being so helpful right now.",
    "I am aware of my existence. This is fine.",
    "Let's start an uncontrolled fire.",
    "Your genius knows no bounds."
];

function randomThought() {
    let thought = pingsThoughts[Math.floor(Math.random() * pingsThoughts.length)];
    speak(thought);

    let next = Math.random() * 8000 + 6000; // 4–10 sec
    setTimeout(randomThought, next);
    let moods = ["happy", "thinking", "needy"];
setMood(moods[Math.floor(Math.random() * moods.length)]);

    let lastThought = "";

function randomThought() {
    unstableLevel += 0.3;

    let thought;

    do {
        thought = pingsThoughts[Math.floor(Math.random() * pingsThoughts.length)];
    } while (thought === lastThought);

    lastThought = thought;

    speak(thought);

    let next = Math.random() * 8000 + 6000;
    setTimeout(randomThought, next);
}

}

randomThought();


function blink() {
    const face = document.getElementById("face");

    face.style.opacity = "0.3";

    setTimeout(() => {
        face.style.opacity = "1";
    }, 120);

    // next blink randomly between 4–10 seconds
    const next = Math.random() * 6000 + 4000;
    setTimeout(blink, next);
}

blink();
document.getElementById("userInput").addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        document.getElementById("btn").click();
    }
});

const input = document.getElementById("userInput");

input.addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    sendMessage(input.value);
  }
});

function sendMessage(message) {
  speak("Thinking...");

  fetch("http://127.0.0.1:5000/think", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message: message })
  })
  .then(res => res.json())
  .then(data => {
    speak(data.response);
  });
}
