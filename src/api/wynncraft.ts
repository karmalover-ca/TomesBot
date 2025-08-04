import axios from "axios";
import { LOGGER } from "../constants";

const API_URL = "https://api.wynncraft.com/v3/"
const RANKS = ['owner', 'chief', 'strategist', 'captain', 'recruiter', 'recruit'] as const;

class GuildNotFoundError extends Error {}
class MemberNotFoundError extends Error {}
class ApiError extends Error {}


interface MemberInfo {
    uuid: string; 
    online: boolean;
    server: string | null;
    contributed: number;
    contributionRank?: number;
    joined: string;
}

interface MembersData {
    total: number;
    owner?: MemberInfo[];
    chief?: MemberInfo[];
    strategist?: MemberInfo[];
    captain?: MemberInfo[];
    recruiter?: MemberInfo[];
    recruit?: MemberInfo[];
}

/**
 * Guild member type definition from Wynn API v3
 */
export interface GuildMember {
    uuid: string;
    username: string;
    contributed: number;
}

/**
 * Guild type definition from Wynn API v3
 */
export interface Guild {
    name: string;
    prefix: string;
    level: string;
    xp: string;
    members: MembersData;
}

/**
 * Fetch guild details
 * @param guildName Exact name of the guild
 * @returns Guild object
 */
export async function getGuild(guildName: string): Promise<Guild> {
    try {
        const res = await axios.get<Guild>(`${API_URL}/guild/${encodeURIComponent(guildName)}?identifier=username`);
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

        for (const rank of RANKS) {
            const rankData = guild.members[rank];
            if (!rankData) continue;

            for (const username in rankData) {
                if (username === memberName) {
                    const user = rankData[username];
                    return {
                        username,
                        uuid: user.uuid,
                        contributed: user.contributed
                    }

                }
            }
        }

        return {
            uuid: "",
            username: "",
            contributed: 0
        };

    } catch (error) {
        LOGGER.warn(error);
        throw error;
    }
}


/**
 * Fetch all members and their details from a guild
 * @param guildName Exact name of the guild
 * @returns GuildMember object array
 */
export async function getGuildMembers(guildName: string): Promise<GuildMember[]> {
    try {
        const guild: Guild = await getGuild(guildName);

        let result: GuildMember[] = [];

        for (const rank of RANKS) {
            const rankData = guild.members[rank];
            if (!rankData) continue;

            for (const username in rankData) {
                const user = rankData[username];
                result.push({
                    username,
                    uuid: user.uuid,
                    contributed: user.contributed
                });
            }
        }

        return result;

    } catch (error) {
        LOGGER.warn(error);
        throw error;
    }
}
