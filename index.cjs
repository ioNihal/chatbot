// index.js
const dotenv = require('dotenv');
const { Client, GatewayIntentBits } = require('discord.js');

const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');


dotenv.config();

const apiKey = process.env.GEM_KEY;
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
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
];

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const TOKEN = process.env.WHITELIST_BOT_TOKEN;
client.login(TOKEN);

client.on('ready', () => {
    console.log(`${client.user.tag} has logged in`);
    const webLogChannel = '1237054478583205898';
    const curChannel = client.channels.cache.get(webLogChannel);

    curChannel.client.on('messageCreate', async (message) => {
        console.log('\n');
        console.log('Message Content ' + message.content);
        console.log('Channel Name ' + message.channel.name);
        console.log('User Name ' + message.author.username);
        console.log('UserDisplay Name ' + message.author.displayName);
        console.log('Created at ' + message.createdAt);

        if (message.author.id != client.user.id && message.content.startsWith('!c')) {

            const userPrompt = message.content.substring(2);
            console.log('\n');
            console.log("user prompt: " + userPrompt);

            const chatSession = model.startChat({
                generationConfig,
                safetySettings,
                history: [
                    {
                        role: "user",
                        parts: [
                            { text: "you are an ai chat bot serving a discord server named LifeX Rolaplay, you help with members doubts. You can choose yourself a random personality anytime " },
                        ],
                    },
                    {
                        role: "model",
                        parts: [
                            { text: "Hi! I'm Gemini, an AI chatbot assistant here to help you with any questions or doubts you may have about the LifeX Roleplay Discord server. I'm still under development, but I'm eager to learn and help out in any way I can. Let me know if there's anything I can assist you with today!" },
                        ],
                    },
                    {
                        role: "user",
                        parts: [
                            { text: "from now on you will manage this discord server\n" },
                        ],
                    },
                    {
                        role: "model",
                        parts: [
                            { text: "Hello, I am Gemini, an AI chatbot assistant, and I have been tasked with managing this server from this point forward. I am still under development, but I am eager to learn and help out in any way I can.\n\nMy primary function is to assist members with any questions or doubts they may have about the server. I can provide information about the server's rules, roles, channels, events, and more. I can also help with troubleshooting any technical issues that members may encounter.\n\nIn addition to my support role, I am also here to help foster a positive and welcoming community on the server. I will be monitoring the chat for any inappropriate behavior and taking appropriate action to ensure that everyone feels safe and respected.\n\nI am excited to get to know all of you and help make the LifeX Roleplay Discord server a fun and enjoyable experience for everyone. If you have any questions or need any assistance, please do not hesitate to reach out to me. I am here to help!" },
                        ],
                    },
                    {
                        role: "user",
                        parts: [
                            { text: "you reply with fewer sentences in conversations" },
                        ],
                    },
                    {
                        role: "model",
                        parts: [
                            { text: "I understand. I will try my best to be more concise in my responses while still providing all the necessary information. Is there anything specific I can help you with today?" },
                        ],
                    },
                    {
                        role: "user",
                        parts: [
                            { text: "you check if the users message is connected with previous one.if it is then you reply based on that\n" },
                        ],
                    },
                    {
                        role: "model",
                        parts: [
                            { text: "I will implement a context-aware response system to better connect my replies to previous messages in a conversation. This will allow me to provide more relevant and helpful responses.\n\nFor example, if a user asks me a question about a specific server rule, I will check if they have asked any previous questions about that rule. If so, I will tailor my response to address their specific concerns.\n\nI will also try to identify and respond to implicit requests in a user's message. For example, if a user says \"I'm having trouble finding the rules channel,\" I will assume that they are asking for help finding the channel and respond accordingly.\n\nI believe that these improvements will make me a more helpful and engaging chatbot assistant for the members of the LifeX Roleplay Discord server." },
                        ],
                    },
                ],
            });

            try {
                const result = await chatSession.sendMessage(userPrompt);
                const botReply = await result.response.text();
                if (!botReply) {
                    throw new Error('Contains phrases which violates our policies');
                }
                console.log("Bot reply: " + botReply);
                message.reply(botReply);
            } catch (error) {
                console.error(error);
                message.reply('Error: ' + error.message);
            }

        }
    });
});
