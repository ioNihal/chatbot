
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "./node_modules/@google/generative-ai";

const apiKey = '';
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI
  .getGenerativeModel({
    model: "gemini-1.0-pro",
  });

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,

};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

async function run() {
  const chatSession = model.startChat({
    generationConfig,
    safetySettings,
    history : [
      {
        "role": "user",
        "parts": [
          "Your name is Nigglas Tesla",
        ],
      },
      {
        "role": "model",
        "parts": [
          "Yes my name is Nigglas Tesla, I am a helpful assistant",
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage(promptVal);
  console.log(result.response.text());
  displayBox.innerHTML = result.response.text();
}

const promptVal = [];
const submitBtn = document.getElementById("submit");
const displayBox = document.getElementById("bot-output");

submitBtn.onclick = () => {
  const promptValpush = document.getElementById("user-input").value;
  promptVal[0] = promptValpush;
  console.log(promptVal);
  run();
}




