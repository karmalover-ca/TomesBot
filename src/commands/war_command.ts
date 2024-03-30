import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { LOGGER } from "../constants";
import { getUser, saveUser } from "../database";
import BaseCommand from "./base_command";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import mcdata from "mcdata";

class WarCommand extends BaseCommand {
    constructor() {
        super({
            name: "war",
            description: "war things",
            dm_permission: false,

            options: [
                {
                    name: "add",
                    description: "adds new war to player",
                    type: ApplicationCommandOptionType.Subcommand,

                    options: [
                        {
                            name: "username",
                            description: "the username of the player",
                            type: ApplicationCommandOptionType.String,
                            required: true
                        }
                    ]
                },
                {
                    name: "remove",
                    description: "removes latest new point",
                    type: ApplicationCommandOptionType.Subcommand,

                    options: [
                        {
                            name: "username",
                            description: "the username of the player",
                            type: ApplicationCommandOptionType.String,
                            required: true
                        }
                    ]
                }
            ]
        });
    }

    public handle = async (interaction: ChatInputCommandInteraction) => {
        const command  = interaction.options.getSubcommand(true);
        await interaction.deferReply().catch(LOGGER.error);
        const uuid = await mcdata.player.getUUID(interaction.options.getString("username", true));

        if (command == "add") {
            const user = await getUser(uuid);
            user.wars.push(Date.now());
            await saveUser(user);
            await interaction.followUp(`added war entry to ${await mcdata.player.getUsername(uuid)}`).catch(LOGGER.error);
        }
        if (command == "remove") {
            const user = await getUser(uuid);
            user.wars.pop();
            await saveUser(user);
            await interaction.followUp(`removed latest war entry to ${await mcdata.player.getUsername(uuid)}`).catch(LOGGER.error);
        }
    }
}

export default WarCommand;