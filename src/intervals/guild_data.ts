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

        const lastExp = user.exp[0] ?? null;
        const current = member.contributed;

        if (lastExp === current) {
            //LOGGER.warn(`Did not update for user '${member.username}' ${lastExp} ${current}`);
            continue;
        };

        if (!Array.isArray(user.exp)) {
            user.exp = [];
        }

        user.exp.push(current);

        if (user.exp.length > 2) user.exp.shift();

        LOGGER.debug(`Updated user '${member.username}' - ${lastExp} -> ${current}`);

        console.log(user);

        await saveUser(user);
    }
}

export default startInterval;