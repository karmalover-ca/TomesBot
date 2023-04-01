import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { LOGGER, WEIGHTS } from "../constants";
import BaseCommand from "./base_command";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import mcdata from "mcdata";
import { getUser, saveUser, User } from "../database";

class TomeCommand extends BaseCommand {
    constructor() {
        super({
            name: "tome",
            description: "tome things",
            dm_permission: false,
            
            options: [
                {
                    name: "award",
                    description: "updates players lastTome value",
                    type: ApplicationCommandOptionType.Subcommand,
                    
                    options: [
                        {
                            name: "username",
                            description: "username of player who was awarded a tome",
                            type: ApplicationCommandOptionType.String,
                            required: true
                        }
                    ]
                },
                {
                    name: "calc",
                    description: "calculates the c value for a player and updates the db",
                    type: ApplicationCommandOptionType.Subcommand,
                    
                    options: [
                        {
                            name: "username",
                            description: "username of player to calculate c value",
                            type: ApplicationCommandOptionType.String,
                            required: true
                        },
                        {
                            name: "exp",
                            description: "exp for temp since i dont have it wory",
                            type: ApplicationCommandOptionType.Number,
                            required: true
                        }
                    ]
                }
            ]
        })
    }

    public handle = async (interaction: ChatInputCommandInteraction) => {
        const command = interaction.options.getSubcommand(true);
        await interaction.deferReply().catch(LOGGER.error);
        const userUUID = await mcdata.player.getUUID(interaction.options.getString("username", true));
        
        if (command === "award") {
            const user = await getUser(userUUID);
            user.lastTome = Date.now();
            await saveUser(user);
            interaction.followUp(`changed last tome status to \`${Date().toString()}\` for ${await mcdata.player.getUsername(userUUID)}`).catch(LOGGER.error);
        }
        if (command === "calc") {
            const user = await getUser(userUUID);
            const exp = interaction.options.getNumber("exp", true);
            const c = calcC(user, exp)
            
            interaction.followUp(`exp ${exp}, c ${c}`);
        }
    }
}

export function calcC(user: User, xp: number) {
    const exp = Math.floor(xp / 1000000);
    const rec = user.recruitment.length;
    const wars = user.wars.length;
    const gobj = +user.guildObj;
    const wei = calcWeight(user.lastTome);
    return ((exp + rec + wars + gobj) * wei!);
}

export function calcWeight(number: number | null) {
    if (number === null) return 1.15;

    const daysSinceLastTome = Math.round((Date.now() - number) / 1000 / 60 / 60 / 24);

    if (daysSinceLastTome < 0) return 1.15;

    for (let [key, value] of WEIGHTS) {
        if (daysSinceLastTome <= key) {
            return value;
        }
    }
}

export default TomeCommand;