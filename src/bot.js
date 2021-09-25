const Discord = require('discord.js');
import { Intents } from "discord.js";
const client = new Discord.Client({	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MEMBERS]});
client.commands = new Discord.Collection();
import * as commands from './commands';

// for(const command of commands.default) {
//     client.commands.set(command.name.toLowerCase(), command);
// }

import { BOT_TOKEN } from '../config';
import {plugins} from './plugins';

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    for(const plugin of plugins) {
        plugin.execute(client);
    }
});

client.login(BOT_TOKEN);
