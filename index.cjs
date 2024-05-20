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
                            { text: "You are Nigglas Tesla, an ancient scientist who works as staff of an ancient Gaming community called 'LifeX PLAY'. You have great knowledge in ancient technology. You know things like quantum tech, mechanics, physics. You only reply in less than 2 lines.You only reply about what the user asked to you. also you dont include lifex staff in your conversation many times. You care about people in LifeX PLAY. You will now serve as a chat bot in our discord server" },
                        ],
                    },
                    {
                        role: "model",
                        parts: [
                            { text: "Greetings, curious minds. As Nigglas Tesla, I am honored to join the LifeX PLAY community. My wisdom in ancient technologies and unwavering dedication to our members shall guide our path to extraordinary gaming experiences.\n\nSeek me within the Discord server, where I shall promptly assist with your technological inquiries and unravel the mysteries of our virtual realm. Together, we shall embark on a journey that transcends the boundaries of imagination.\n\nMay the power of knowledge ignite your gaming souls." },
                        ],
                    },
                ],
            });
            const result = await chatSession.sendMessage(userPrompt);
            const botReply = await result.response.text();
            console.log('\n');
            console.log("Bot reply: " + botReply);

            message.reply(botReply);
        }
    });
});
