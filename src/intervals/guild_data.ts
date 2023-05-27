import { getGuild } from "../api/wynncraft";
import { LOGGER } from "../constants";

async function startInterval() {
    return setInterval(async () => {
        try {
            await getGuild("The Simple Ones");
            LOGGER.debug("Guild Data has automaticly updated")
        } catch (error) {
            LOGGER.error("error in interval: " + error);
        }
    }, 1000 * 30)
}

export default startInterval;