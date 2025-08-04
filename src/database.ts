import { Db, MongoClient, ObjectId } from "mongodb";
import { LOGGER, MONGO_URI } from "./constants";
import { Recruitment } from "./commands/recruit_command";

const v: any = {};

export interface User {
    uuid: string;
    guildObj: boolean;
    exp: number[];
    wars: number[];
    recruitment: Recruitment[];
    lastTome: number | null;
    cValue: number | null;
}

export const defaultUser = (uuid: string): User => {
    return {
        uuid: uuid,
        guildObj: false,
        exp: [],
        wars: [],
        recruitment: [],
        lastTome: null,
        cValue: null
    };
}

export async function getClient(): Promise<MongoClient> {
    if(v.client) return v.client;

    v.client = new MongoClient(MONGO_URI);
    return v.client;
}

export function getDatabaseSync(database = "tomes"): Db {
    if(v.database) return v.database;
    if(v.client) {
        v.database = v.client.db(database);
        return v.database;
    }
    throw new Error("client not yet initialized");
}

export async function getUser(uuid: string): Promise<User> {
    const db = getDatabaseSync();
    const ru = await db.collection("guild_users").findOne({ uuid: uuid });

    // typescript
    let r = ru as any;
    if (r == null) r = defaultUser(uuid); 

    delete r._id;

    r = clearOldUserObjects(r);

    return r;
}

export async function saveUser(user: User) {

    const db = getDatabaseSync();

    return await db.collection("guild_users").replaceOne({uuid: user.uuid}, user, {
        upsert: true
    });
}

export async function deleteUser(user: User) {
    const db = getDatabaseSync();
    const col = await db.collection("guild_users").deleteOne(user);
}


async function clearOldUserObjects(user: User): Promise<User> {
    let itemsToRemove: any;
    for (const recruitment of user.recruitment) {
        if(recruitment.date <= Date.now()) {
            user.recruitment = user.recruitment.filter(item => item !== recruitment);
        }
    }
    saveUser(user);

    return user;
}