import { Client } from "discord.js";
import { FileLogger, ConsoleLogger } from "./logging";
import dotenv from "dotenv";

dotenv.config();

export const CURRENT_VERSION = "0.0.1";

// do something about this if I ever need to shard
export const GUILD_COUNT = (client: Client): number => {
    return client.guilds.cache.size;
}

export const APPLICATION_ID: string = "1015266412845084754";

export const BOT_TOKEN: string = process.env.BOT_TOKEN!;

export const DEV_SERVER = process.env.TEST_SERVER_ID;

export const DEV_ENVIRONMENT = DEV_SERVER != undefined;

export const DEFAULT_LOGGER = DEV_ENVIRONMENT ? new ConsoleLogger() : new FileLogger(process.env.LOGFILE || (__dirname + "./log.log"));

export const MONGO_URI = process.env.MONGODB_URI || "";