import { ChatInputCommandInteraction } from "discord.js";
import { LOGGER } from "../constants";
import BaseCommand from "./base_command";
import { getGuildMember } from "../api/wynncraft";

class DebugCommand extends BaseCommand {
    constructor() {
        super({
            name: "debug",
            description: "debug uwu"
        });
    }

    public handle = async (interaction: ChatInputCommandInteraction) => {
        interaction.reply(JSON.stringify(await getGuildMember("The Simple Ones", "KarmaLover"), null, 4));
        LOGGER.debug(JSON.stringify(await getGuildMember("The Simple Ones", "KarmaLover"), null, 4));
    }
}

export default DebugCommand;