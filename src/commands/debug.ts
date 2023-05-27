import { ChatInputCommandInteraction } from "discord.js";
import { LOGGER } from "../constants";
import BaseCommand from "./base_command";
import { getGuild, getGuildMember } from "../api/wynncraft";

class DebugCommand extends BaseCommand {
    constructor() {
        super({
            name: "debug",
            description: "debug uwu"
        });
    }

    public handle = async (interaction: ChatInputCommandInteraction) => {
        interaction.reply(JSON.stringify(await getGuildMember("KarmaLover", "The Simple Ones"), null, 4));
        LOGGER.debug(JSON.stringify(await getGuildMember("KarmaLover", "The Simple Ones"), null, 4));
    }
}

export default DebugCommand;