import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { LOGGER } from "../constants";
import { defaultUser, getUser, saveUser, deleteUser } from "../database";
import BaseCommand from "./base_command";
//import { getName, getUUID } from "../apis/mojang";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import mcdata from 'mcdata';

class UserCommand extends BaseCommand {
    constructor() {
        super({
            name: "user",
            description: "user things",
            dm_permission: false,

            options: [
                {
                    name: "get",
                    description: "get info about player",
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
                    name: "reset",
                    description: "resets all gathered info about a player",
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
        const uuid = await mcdata.player.getUUID(interaction.options.getString("username", true));
        await interaction.deferReply().catch(LOGGER.error);

        if (command === "get") {
            const user = JSON.parse(JSON.stringify(await getUser(uuid)));
            await interaction.followUp("```json\n" + JSON.stringify(user, null, 4) + "```").catch(LOGGER.error);
        }
        if (command === "reset") {
            const user = await getUser(uuid);
            await deleteUser(user);
            await interaction.followUp(`Deleted all data for user ${await mcdata.player.getUsername(uuid)}.`)
        }
    }
}

export default UserCommand;