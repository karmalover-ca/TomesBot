import axios from "axios";
import { LOGGER } from "../constants";

const API_URL = "https://api.wynncraft.com/v3/"

class GuildNotFoundError extends Error {}
class MemberNotFoundError extends Error {}
class ApiError extends Error {}

/**
 * Guild member type definition from Wynn API v3
 */
export interface GuildMember {
    name: string;
    uuid: string;
    joined: number; // unix timestamp
    contributed: number; // total xp contributed to the guild
    playtime: number; // total playtime
    wars: number; // total wars participated in
}

/**
 * Guild type definition from Wynn API v3
 */
export interface Guild {
    name: string;
    prefix: string;
    level: string;
    xp: string;
    members: GuildMember[];
}

/**
 * Fetch guild details
 * @param guildName Exact name of the guild
 * @returns Guild object
 */
export async function getGuild(guildName: string): Promise<Guild> {
    try {
        const res = await axios.get<Guild>(`${API_URL}/guild/${encodeURIComponent(guildName)}`);
        return res.data;
    } catch (error: any) {
        LOGGER.warn(`Failed to fetch guild '${guildName}' Error:\n${error}`);
        
        if (error.response?.status === 404) {
            throw new GuildNotFoundError(`Guild '${guildName}' not found`);
        } else if (error.code === "ECONNABORTED") {
            throw new ApiError("Request timed out. Please try again later");
        } else {
            throw new ApiError(`API error: ${error.message}`);
        }
    }
}

/**
 * Fetch member details from a guild
 * @param guildName Exact name of the guild
 * @param memberName Exact username of the member
 * @returns GuildMember object
 */
export async function getGuildMember(guildName: string, memberName: string): Promise<GuildMember> {
    try {
        const guild: Guild = await getGuild(guildName);

        const member = guild.members.find((m) => m.name.toLowerCase() === memberName.toLowerCase());

        if (!member) {
            const errorMsg = `Member '${memberName}' not found in guild '${guildName}'.`
            LOGGER.warn(errorMsg);
            throw new MemberNotFoundError(errorMsg);
        }

        return member;

    } catch (error) {
        LOGGER.warn(error);
        throw error;
    }
}