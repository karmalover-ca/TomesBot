import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { LOGGER } from "../constants";
import BaseCommand from "./base_command";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import mcdata from "mcdata";
import { getUser, saveUser } from "../database";

class ObjectiveCommand extends BaseCommand {
    constructor() {
        super({
            name: "objective",
            description: "guild objective things",
            dm_permission: false,

            options: [
                {
                    name: "username",
                    description: "the user you wish to edit",
                    type: ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: "completed",
                    description: "sets guild objective true or false in database",
                    type: ApplicationCommandOptionType.Boolean,
                    required: true
                }
            ]
        })
    }

    public handle =async (interaction: ChatInputCommandInteraction) => {
        await interaction.deferReply().catch(LOGGER.error);
        const userUUID = await mcdata.player.getUUID(interaction.options.getString("username", true));
        const user = await getUser(userUUID);
        user.guildObj = interaction.options.getBoolean("completed", true);
        await saveUser(user);
        interaction.followUp(`changed guild objective status to ${user.guildObj} for ${await mcdata.player.getUsername(userUUID)}`).catch(LOGGER.error);
    }
}

export default ObjectiveCommand;