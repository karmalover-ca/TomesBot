import { Client } from "discord.js";
import { ConsoleLogger, FileLogger, Logger } from "./logger";

export const CURRENT_VERSION = "0.0.1";

// do something about this if I ever need to shard
export const GUILD_COUNT = (client: Client): number => {
    return client.guilds.cache.size;
}

export const IS_PRODUCTION: boolean = process.env.PRODUCTION != undefined;

export const APPLICATION_ID: string = process.env.APPLICATION_ID || "";

export const BOT_TOKEN: string = process.env.BOT_TOKEN || "";

export const DEV_SERVER = process.env.TEST_SERVER_ID;

export const DEV_ENVIRONMENT = DEV_SERVER != undefined;

export const LOGGER: Logger = IS_PRODUCTION ? new FileLogger(process.env.LOG_FILE ?? "./tomesBot.log") : new ConsoleLogger();

export const MONGO_URI = process.env.MONGODB_URI || "";

export let WEIGHTS: Map<number, number> = new Map();
// days greater then, weight
WEIGHTS.set(1, 0.2);
WEIGHTS.set(3, 0.3);
WEIGHTS.set(7, 0.4);
WEIGHTS.set(10, 0.5);
WEIGHTS.set(14, 0.6);
WEIGHTS.set(20, 0.75);
WEIGHTS.set(25, 0.9);
WEIGHTS.set(30, 1);
WEIGHTS.set(35, 1.05);
WEIGHTS.set(40, 1.1);
WEIGHTS.set(50, 1.15);
WEIGHTS.set(60, 1.2);
