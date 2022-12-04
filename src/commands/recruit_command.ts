import { ChatInputCommandInteraction } from "discord.js";
import { DEFAULT_LOGGER } from "../constants";
import BaseCommand from "./base_command";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import mcdata from "mcdata";

class RecruitCommand extends BaseCommand {
    constructor() {
        super({
            name: "recruit",
            description: "recruit things!"
        });
    }

    public handle = async (interaction: ChatInputCommandInteraction) => {
        interaction.reply("Pong!").catch(DEFAULT_LOGGER.log);
    }
}

export default RecruitCommand;