import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { LOGGER } from "../constants";
import BaseCommand from "./base_command";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import mcdata from "mcdata";
import { getUser, saveUser } from "../database";

class RecruitCommand extends BaseCommand {
    constructor() {
        super({
            name: "recruit",
            description: "recruit things!",
            dm_permission: false,

            options: [
                {
                    name: "add",
                    description: "add new recruitment to player",
                    type: ApplicationCommandOptionType.Subcommand,

                    options: [
                        {
                            name: "username",
                            description: "the users who recruited the person",
                            type: ApplicationCommandOptionType.String,
                            required: true
                        },
                        {
                            name: "recruited",
                            description: "the user who was recruited",
                            type: ApplicationCommandOptionType.String,
                            required: true
                        }
                    ]
                },
                {
                    name: "remove",
                    description: "removes latest recruited person from user",
                    type: ApplicationCommandOptionType.Subcommand,
                    
                    options: [
                        {
                            name: "username",
                            description: "the user you with to modify",
                            type: ApplicationCommandOptionType.String,
                            required: true
                        }
                    ]
                }
            ]
        });
    }

    public handle = async (interaction: ChatInputCommandInteraction) => {
        const command = interaction.options.getSubcommand(true);
        await interaction.deferReply().catch(LOGGER.error);
        const userUUID = await mcdata.player.getUUID(interaction.options.getString("username", true));
        

        if (command == "add") {
            const recruitedUUID = await mcdata.player.getUUID(interaction.options.getString("recruited", true)).catch(LOGGER.error);
            const user = await getUser(userUUID);
            const recruitment = {
                recruited: recruitedUUID,
                date: Date.now() + (1000 * 60)
            }
            user.recruitment.push(recruitment);
            await saveUser(user);
            await interaction.followUp(`added recruitment entry to ${await mcdata.player.getUsername(userUUID)}`).catch(LOGGER.error);
        }
        if (command == "remove") {
            const user = await getUser(userUUID);
            user.recruitment.pop();
            await saveUser(user);
            await interaction.followUp(`removed latest recruitment entry for ${await mcdata.player.getUsername(userUUID)}`).catch(LOGGER.error);
        }
    }
}

export type Recruitment = {
    recruited: string;
    date: number;
}

export default RecruitCommand;