import { bullConnection } from "@/lib/redis";
import { Queue } from "bullmq";
// Create a BullMQ queue for handling email jobs
export const emailQueue = new Queue("email", {
    connection: bullConnection
});
