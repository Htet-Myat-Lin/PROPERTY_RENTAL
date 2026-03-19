import { redisClient } from "@/lib/redis"
import { NextFunction, Request, Response } from "express"

export const cache = (ttl: number = 60, tag: string = "default") => {
    return async(req: Request, res: Response, next: NextFunction) => {
        const key = `cache:${req.method}:${req.originalUrl}`
        try {
            const cached = await redisClient.get(key)
            if (cached) {
                const parsed = JSON.parse(cached)
                // parsed.statusCode is stored as a number when caching
                return res.status(parsed.statusCode || 200).json(parsed.data)
            }

            // Store original status method to track status code
            const originalStatus = res.status.bind(res)
            let statusCode = 200
            
            res.status = function(code: number) {
                statusCode = code
                return originalStatus(code)
            }

            // override res.json to intercept and cache the response
            const originalJson = res.json.bind(res)

            res.json = (data: any) => {
                // store response data with in redis
                redisClient.setEx(key, ttl, JSON.stringify(data)).catch(console.error)
                // store key under tag
                redisClient.SADD(`tags:${tag}`, key).catch(console.error)
                // send response
                return originalJson(data)
            }

            next()
        } catch(err) {
            console.error('Cache middleware error:', err);
            next(err)
        }
    }
}