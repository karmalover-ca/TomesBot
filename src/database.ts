import { Db, MongoClient, ObjectId } from "mongodb";
import { MONGO_URI } from "./constants";

const v: any = {};

export type User = {
    uuid: string;
    guildObj: boolean;
    exp: {[key: number]: string}
    wars: [...number[]];
    recruitment: {[key: number]: string}
    lastTome: number | null;
    cValue: number | null;
}

export const defaultUser = (uuid: string): User => {
    return {
        uuid: uuid,
        guildObj: false,
        exp: {},
        wars: [],
        recruitment: {},
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

export async function getUsers(uuid: string): Promise<User> {
    const db = getDatabaseSync();
    const ru = await db.collection("guild_users").findOne({ uuid: uuid });

    // typescript
    let r = ru as any;
    if (r == null) r = defaultUser(uuid);

    delete r._id;

    return r;
}

export function saveUsers(user: User) {
    const db = getDatabaseSync();

    return db.collection("guild_users").replaceOne({uuid: user.uuid}, user, {
        upsert: true
    });
}