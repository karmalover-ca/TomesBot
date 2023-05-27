import axios from "axios";
import { LOGGER } from "../constants";

type GetGuildResponse = {
    name: string; 
    members: [{
        name: string;
        uuid:string;
        rank: string;
        contributed: string;
        joinedFriendly: string;
    }];
}

let guildData: GetGuildResponse;

export async function getGuild(name: string) {
    try {
        const { data, status } = await axios.get<GetGuildResponse>(
            `https://api.wynncraft.com/public_api.php?action=guildStats&command=${name.replace(" ", "%20")}`,
            {
                headers: {
                    Accept: "application/json",
                },
            },
        );

        LOGGER.info("response status is: " + status);

        guildData = data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            LOGGER.error("error message: " + error.message);
        } else {
            LOGGER.error("unexpected error: " + error);
        }
    }   
}

export async function getGuildMember(username: string, guildName: string) {
    if (guildData === undefined) {
        await getGuild(guildName);
    }

    return getObjectByName(guildData.members, username);
}

const getObjectByName = (list: any[], targetName: string): any | undefined => {
    return list.find(obj => obj.name === targetName);
};