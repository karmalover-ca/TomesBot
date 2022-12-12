import { Client } from "discord.js";
import { commandHandler, registerCommands } from "./commands/commands";
import { BOT_TOKEN, CURRENT_VERSION, DEV_ENVIRONMENT, DEV_SERVER, LOGGER } from "./constants";
import { getClient } from "./database";

const client = new Client({
    intents: ["DirectMessages","DirectMessageTyping","DirectMessageReactions","GuildMessages","GuildMessageTyping","GuildMessageReactions"]
});

client.on("ready", () => {
    LOGGER.info("Tomes bot online. Version v" + CURRENT_VERSION);
});

client.on("interactionCreate", (interaction) => {
    if(interaction.isChatInputCommand()) return commandHandler(interaction);
});

registerCommands().then(() => {
    return getClient();
}).then(() => {
    return client.login(BOT_TOKEN);
}).catch(LOGGER.error);