import { redisClient } from "@/lib/redis";
export const cache = (ttl = 60, tag = "default") => {
    return async (req, res, next) => {
        const key = `cache:${req.method}:${req.originalUrl}`;
        try {
            const cached = await redisClient.get(key);
            if (cached) {
                const parsed = JSON.parse(cached);
                // parsed.statusCode is stored as a number when caching
                return res.status(parsed.statusCode || 200).json(parsed.data);
            }
            // Store original status method to track status code
            const originalStatus = res.status.bind(res);
            let statusCode = 200;
            res.status = function (code) {
                statusCode = code;
                return originalStatus(code);
            };
            // override res.json to intercept and cache the response
            const originalJson = res.json.bind(res);
            res.json = (data) => {
                const cachedData = { statusCode, data };
                // store response data with in redis
                redisClient.setEx(key, ttl, JSON.stringify(cachedData)).catch(console.error);
                // store key under tag
                redisClient.SADD(`tags:${tag}`, key).catch(console.error);
                // send response
                return originalJson(data);
            };
            next();
        }
        catch (err) {
            console.error('Cache middleware error:', err);
            next(err);
        }
    };
};
