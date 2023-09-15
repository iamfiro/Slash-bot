import { Client, GatewayIntentBits, REST } from 'discord.js';
import 'dotenv/config';

export const client = new Client({
    intents: [
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildModeration
    ]
});

export const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN ?? '')