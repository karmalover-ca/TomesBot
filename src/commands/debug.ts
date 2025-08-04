import { ChatInputCommandInteraction } from "discord.js";
import { LOGGER } from "../constants";
import BaseCommand from "./base_command";
import { getGuildMember, getGuildMembers } from "../api/wynncraft";

class DebugCommand extends BaseCommand {
    constructor() {
        super({
            name: "debug",
            description: "debug uwu"
        });
    }

    public handle = async (interaction: ChatInputCommandInteraction) => {
        interaction.reply("works!");
        LOGGER.debug(JSON.stringify(await getGuildMembers("The Simple Ones"), null, 4));
    }
}

export default DebugCommand;