import { redisClient } from "@/lib/redis";
export const clearCache = async (tag) => {
    const keys = await redisClient.SMEMBERS(`tags:${tag}`);
    if (keys && keys.length > 0) {
        await redisClient.DEL(keys);
        await redisClient.DEL(`tags:${tag}`);
    }
};
