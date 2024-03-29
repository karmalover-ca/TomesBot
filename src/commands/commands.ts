import { ApplicationCommand, ChatInputCommandInteraction, MessageContextMenuCommandInteraction, REST, Routes, Snowflake } from "discord.js";
import { APPLICATION_ID, BOT_TOKEN, DEV_ENVIRONMENT, DEV_SERVER, LOGGER } from "../constants";

import BaseCommand, { ApplicationCommandStructure } from "./base_command";
import PingCommand from "./ping_command";
import UserCommand from "./user_command";
import WarCommand from "./war_command";
import RecruitCommand from "./recruit_command";
import ObjectiveCommand from "./objective_command";
import TomeCommand from "./tome_command";
import DebugCommand from "./debug";

const rest = new REST({ version: "10" }).setToken(BOT_TOKEN);

const commands: BaseCommand[] = [
    new PingCommand(),
    new UserCommand(),
    new WarCommand(),
    new RecruitCommand(),
    new ObjectiveCommand(),
    new TomeCommand(),
    new DebugCommand()
];

const validationRegex = /^[-_\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$/u;

const registerCommands = () => {

    if (DEV_ENVIRONMENT) {
        const definitions = commands.map(c => c.definition);
        definitions.forEach((v, i, a) => {
            if (!a[i].name.startsWith("t_")) a[i].name = "t_" + v.name;
        });

        return rest.put(Routes.applicationGuildCommands(APPLICATION_ID, DEV_SERVER as string), {
            body: definitions
          });
    }
    return rest.put(Routes.applicationCommands(APPLICATION_ID), {
        body: commands.map(c => c.definition)
    });
}

const registerTagCommand = (definition: ApplicationCommandStructure, guildID: Snowflake) => {
    return rest.post(Routes.applicationGuildCommands(APPLICATION_ID, guildID), {
        body: definition
    });
}

const removeTagCommand = async (name: string, guildID: Snowflake) => {
    const commands = (await rest.get(Routes.applicationGuildCommands(APPLICATION_ID, guildID))) as ApplicationCommand[];
    const c = commands.find(v => v.name == name);
    if (!c) return false;

    await rest.delete(Routes.applicationGuildCommand(APPLICATION_ID, guildID, c.id));
    return true;
}

const commandHandler = (interaction: ChatInputCommandInteraction) => {
    if (DEV_ENVIRONMENT && !interaction.commandName.startsWith("t_")) return;

    const i = commands.findIndex(v => v.definition.name == interaction.commandName);

    const r = commands[i].handle(interaction);
    if (r instanceof Promise) r.catch(LOGGER.error);
}

export { registerCommands, commandHandler, registerTagCommand, removeTagCommand };