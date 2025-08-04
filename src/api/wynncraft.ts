import axios from "axios";
import { LOGGER } from "../constants";

const API_URL = "https://api.wynncraft.com/v3/"

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

        //console.log(guild.members)
        const member: GuildMember = await extractMember(guild.members, memberName);

        if (member.uuid === "") {
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

/**
 * Parses raw member data to extract a member by username
 * @param data raw guild member data
 * @param memberName member you wish to extract
 * @returns GuildMember Object
 */
async function extractMember(data: MembersData, memberName: string): Promise<GuildMember> {
    const roles = ['owner', 'chief', 'strategist', 'captain', 'recruiter', 'recruit'] as const;

    let result: GuildMember = {
        uuid: "",
        username: "",
        contributed: 0
    };

    for (const role of roles) {
        const roleData = data[role];
        if (!roleData) continue;

        for (const username in roleData) {

            if (username === memberName) {
                const info = roleData[username];

                return {
                    username,
                    uuid: info.uuid,
                    contributed: info.contributed
                }

            }
            
        }
    }

    return result;
}