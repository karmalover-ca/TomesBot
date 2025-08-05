import { getGuild, getGuildMembers, GuildMember } from "../api/wynncraft";
import { LOGGER } from "../constants";
import cron from 'node-cron';
import { getUser, saveUser, User } from "../database";

function startInterval() {
    updateUsers();
    cron.schedule('*/10 * * * *', updateUsers);
}

async function updateUsers() {
    LOGGER.debug("Start to update users ");
    const members: GuildMember[] = await getGuildMembers("The Simple Ones");

    for (const member of members) {
        //LOGGER.debug(`Updating member '${member.username}'`)
        const user: User = await getUser(member.uuid.replace(/-/g, ""));

        if (!Array.isArray(user.exp)) {
            user.exp = [];
        }

        const current = member.contributed;

        if (user.exp[0] === undefined) {
            user.exp[0] = current;
            user.exp[1] = current;
        } else if (user.exp[1] !== current) {
            user.exp[1] = current;
        } else {
            continue;
        }
        

        LOGGER.debug(`Updated user '${member.username}' - exp[0] '${user.exp[0]}' | exp[1] '${user.exp[1]}'`);

        await saveUser(user);
    }
}

export default startInterval;