import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { DEFAULT_LOGGER } from "../constants";
import { defaultUser, getUser, saveUser } from "../database";
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
                }
            ]
        });
    }

    public handle = async (interaction: ChatInputCommandInteraction) => {
        const command  = interaction.options.getSubcommand(true);
        const uuid = await mcdata.player.getUUID(interaction.options.getString("username", true));
        await interaction.deferReply().catch(DEFAULT_LOGGER.log);

        if (command === "get") {
            const user = JSON.parse(JSON.stringify(await getUser(uuid)));
            await interaction.followUp("```json\n" + JSON.stringify(user, null, 4) + "```").catch(DEFAULT_LOGGER.log);
        }
        if (command === "reset") {
            const user = await getUser(uuid);
            
        }
    }
}

export default UserCommand;